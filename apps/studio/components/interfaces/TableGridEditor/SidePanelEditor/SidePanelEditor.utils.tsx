import type { PostgresPrimaryKey } from '@supabase/postgres-meta'
import { chunk, find, isEmpty, isEqual } from 'lodash'
import Papa from 'papaparse'
import { toast } from 'sonner'

import { Query } from '@pg-meta/src/query'
import SparkBar from 'components/ui/SparkBar'
import type { Constraint } from 'data/database/constraints-query'
import { FOREIGN_KEY_CASCADE_ACTION } from 'data/database/database-query-constants'
import { ForeignKeyConstraint } from 'data/database/foreign-key-constraints-query'
import { databaseKeys } from 'data/database/keys'
import { entityTypeKeys } from 'data/entity-types/keys'
import { prefetchEditorTablePage } from 'data/prefetchers/project.$ref.editor.$id'
import { getQueryClient } from 'data/query-client'
import { executeSql } from 'data/sql/execute-sql-query'
import { tableEditorKeys } from 'data/table-editor/keys'
import { prefetchTableEditor } from 'data/table-editor/table-editor-query'
import { tableRowKeys } from 'data/table-rows/keys'
import { tableKeys } from 'data/tables/keys'
import { getTables } from 'data/tables/tables-query'
import { timeout, tryParseJson } from 'lib/helpers'
import {
  generateCreateColumnPayload,
  generateUpdateColumnPayload,
} from './ColumnEditor/ColumnEditor.utils'
import type { ForeignKey } from './ForeignKeySelector/ForeignKeySelector.types'
import type { ColumnField, CreateColumnPayload, UpdateColumnPayload } from './SidePanelEditor.types'
import { checkIfRelationChanged } from './TableEditor/ForeignKeysManagement/ForeignKeysManagement.utils'
import type { ImportContent } from './TableEditor/TableEditor.types'

const BATCH_SIZE = 1000
const CHUNK_SIZE = 1024 * 1024 * 0.1 // 0.1MB

/**
 * The functions below are basically just queries but may be supported directly
 * from the pg-meta library in the future
 */
export const addPrimaryKey = async (
  projectRef: string,
  connectionString: string | undefined | null,
  schema: string,
  table: string,
  columns: string[]
) => {
  const primaryKeyColumns = columns.join('","')
  const query = `ALTER TABLE "${schema}"."${table}" ADD PRIMARY KEY ("${primaryKeyColumns}")`
  return await executeSql({
    projectRef: projectRef,
    connectionString: connectionString,
    sql: query,
    queryKey: ['primary-keys'],
  })
}

export const dropConstraint = async (
  projectRef: string,
  connectionString: string | undefined | null,
  schema: string,
  table: string,
  name: string
) => {
  const query = `ALTER TABLE "${schema}"."${table}" DROP CONSTRAINT "${name}"`
  return await executeSql({
    projectRef: projectRef,
    connectionString: connectionString,
    sql: query,
    queryKey: ['drop-constraint'],
  })
}

export const getAddForeignKeySQL = ({
  table,
  foreignKeys,
}: {
  table: { schema: string; name: string }
  foreignKeys: ForeignKey[]
}) => {
  const getOnDeleteSql = (action: string) =>
    action === FOREIGN_KEY_CASCADE_ACTION.CASCADE
      ? 'ON DELETE CASCADE'
      : action === FOREIGN_KEY_CASCADE_ACTION.RESTRICT
        ? 'ON DELETE RESTRICT'
        : action === FOREIGN_KEY_CASCADE_ACTION.SET_DEFAULT
          ? 'ON DELETE SET DEFAULT'
          : action === FOREIGN_KEY_CASCADE_ACTION.SET_NULL
            ? 'ON DELETE SET NULL'
            : ''
  const getOnUpdateSql = (action: string) =>
    action === FOREIGN_KEY_CASCADE_ACTION.CASCADE
      ? 'ON UPDATE CASCADE'
      : action === FOREIGN_KEY_CASCADE_ACTION.RESTRICT
        ? 'ON UPDATE RESTRICT'
        : ''
  return (
    foreignKeys
      .map((relation) => {
        const { deletionAction, updateAction } = relation
        const onDeleteSql = getOnDeleteSql(deletionAction)
        const onUpdateSql = getOnUpdateSql(updateAction)
        return `
      ALTER TABLE "${table.schema}"."${table.name}"
      ADD FOREIGN KEY (${relation.columns.map((column) => `"${column.source}"`).join(',')})
      REFERENCES "${relation.schema}"."${relation.table}" (${relation.columns.map((column) => `"${column.target}"`).join(',')})
      ${onUpdateSql}
      ${onDeleteSql}
    `
          .replace(/\s+/g, ' ')
          .trim()
      })
      .join(';') + ';'
  )
}

export const addForeignKey = async ({
  projectRef,
  connectionString,
  table,
  foreignKeys,
}: {
  projectRef: string
  connectionString?: string | null
  table: { schema: string; name: string }
  foreignKeys: ForeignKey[]
}) => {
  const query = getAddForeignKeySQL({ table, foreignKeys })
  return await executeSql({
    projectRef: projectRef,
    connectionString: connectionString,
    sql: query,
    queryKey: ['foreign-keys'],
  })
}

export const getRemoveForeignKeySQL = ({
  table,
  foreignKeys,
}: {
  table: { schema: string; name: string }
  foreignKeys: ForeignKey[]
}) => {
  return (
    foreignKeys
      .map((relation) =>
        `
ALTER TABLE IF EXISTS "${table.schema}"."${table.name}"
DROP CONSTRAINT IF EXISTS "${relation.name}"
`
          .replace(/\s+/g, ' ')
          .trim()
      )
      .join(';') + ';'
  )
}

export const removeForeignKey = async ({
  projectRef,
  connectionString,
  table,
  foreignKeys,
}: {
  projectRef: string
  connectionString?: string | null
  table: { schema: string; name: string }
  foreignKeys: ForeignKey[]
}) => {
  const query = getRemoveForeignKeySQL({ table, foreignKeys })
  return await executeSql({
    projectRef: projectRef,
    connectionString: connectionString,
    sql: query,
    queryKey: ['foreign-keys'],
  })
}

export const updateForeignKey = async ({
  projectRef,
  connectionString,
  table,
  foreignKeys,
}: {
  projectRef: string
  connectionString?: string | null
  table: { schema: string; name: string }
  foreignKeys: ForeignKey[]
}) => {
  const query = `
  ${getRemoveForeignKeySQL({ table, foreignKeys })}
  ${getAddForeignKeySQL({ table, foreignKeys })}
  `
    .replace(/\s+/g, ' ')
    .trim()
  return await executeSql({
    projectRef: projectRef,
    connectionString: connectionString,
    sql: query,
    queryKey: ['foreign-keys'],
  })
}
