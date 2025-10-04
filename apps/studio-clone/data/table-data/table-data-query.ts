import { executeQuery } from 'lib/api/query'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export interface TableColumn {
  table_id: number
  schema: string
  table: string
  id: string
  ordinal_position: number
  name: string
  default_value?: string | null
  data_type: string
  format: string
  is_identity: boolean
  identity_generation?: string | null
  is_generated: boolean
  is_nullable: boolean
  is_updatable: boolean
  is_unique: boolean
  enums: any[]
  check: null
  comment?: string | null
}

export interface TableRowsData {
  columns: TableColumn[]
  rows: any[]
  totalCount: number
}

export type TableDataVariables = {
  projectRef?: string
  connectionString?: string | null
  tableId?: number
  tableName?: string
  schema?: string
  page?: number
  limit?: number
}

export async function getTableData({
  projectRef,
  connectionString,
  tableId,
  tableName,
  schema = 'public',
  page = 1,
  limit = 100,
}: TableDataVariables): Promise<TableRowsData> {
  if (!tableId && !tableName) {
    throw new Error('Either tableId or tableName must be provided')
  }

  // First get table columns
  const columnsSql = /* SQL */ `
    SELECT
      t.oid as table_id,
      n.nspname as schema,
      t.relname as table,
      a.attnum as ordinal_position,
      a.attname as name,
      CASE 
        WHEN a.atthasdef THEN pg_get_expr(ad.adbin, ad.adrelid)
        ELSE NULL
      END as default_value,
      format_type(a.atttypid, a.atttypmod) as data_type,
      format_type(a.atttypid, a.atttypmod) as format,
      a.attidentity != '' as is_identity,
      CASE WHEN a.attidentity != '' THEN a.attidentity ELSE NULL END as identity_generation,
      a.attgenerated != '' as is_generated,
      NOT a.attnotnull as is_nullable,
      true as is_updatable,
      false as is_unique,
      '[]'::json as enums,
      null as check,
      col_description(a.attrelid, a.attnum) as comment
    FROM pg_class t
    JOIN pg_namespace n ON n.oid = t.relnamespace
    JOIN pg_attribute a ON a.attrelid = t.oid
    LEFT JOIN pg_attrdef ad ON ad.adrelid = t.oid AND ad.adnum = a.attnum
    WHERE t.relkind = 'r'
      AND a.attnum > 0
      AND NOT a.attisdropped
      ${tableId ? `AND t.oid = ${tableId}` : `AND t.relname = '${tableName}' AND n.nspname = '${schema}'`}
    ORDER BY a.attnum;
  `

  const { data: columnsResult, error: columnsError } = await executeQuery({
    query: columnsSql,
  })

  if (columnsError) {
    throw columnsError
  }

  const columns = (columnsResult as TableColumn[]) || []

  if (columns.length === 0) {
    return { columns: [], rows: [], totalCount: 0 }
  }

  // Get the actual table name and schema from columns result
  const actualTableName = columns[0].table
  const actualSchema = columns[0].schema

  // First get total count
  const countSql = /* SQL */ `
    SELECT COUNT(*) as total FROM "${actualSchema}"."${actualTableName}";
  `

  const { data: countResult, error: countError } = await executeQuery({
    query: countSql,
  })

  const totalCount = countError ? 0 : (countResult as any)?.[0]?.total || 0

  // Now get table rows with pagination
  const offset = (page - 1) * limit
  const rowsSql = /* SQL */ `
    SELECT * FROM "${actualSchema}"."${actualTableName}" 
    ORDER BY 1 
    LIMIT ${limit} OFFSET ${offset};
  `

  const { data: rowsResult, error: rowsError } = await executeQuery({
    query: rowsSql,
  })

  if (rowsError) {
    // If we can't get rows, just return columns
    console.warn('Failed to fetch table rows:', rowsError)
    return { columns, rows: [], totalCount }
  }

  return {
    columns,
    rows: (rowsResult as any[]) || [],
    totalCount,
  }
}

export type TableDataQueryData = Awaited<ReturnType<typeof getTableData>>
export type TableDataError = Error

export const useTableDataQuery = <TData = TableDataQueryData>(
  {
    projectRef,
    connectionString,
    tableId,
    tableName,
    schema,
    page = 1,
    limit = 100,
  }: TableDataVariables,
  { enabled = true, ...options }: UseQueryOptions<TableDataQueryData, TableDataError, TData> = {}
) => {
  return useQuery<TableDataQueryData, TableDataError, TData>(
    ['table-data', projectRef, tableId || tableName, schema, page, limit],
    ({ signal }) =>
      getTableData({
        projectRef,
        connectionString,
        tableId,
        tableName,
        schema,
        page,
        limit,
      }),
    {
      enabled: enabled && (!!tableId || !!tableName),
      staleTime: 0, // Always refetch for real-time data
      ...options,
    }
  )
}
