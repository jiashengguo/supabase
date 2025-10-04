import { uniq } from 'lodash'
import { useMemo } from 'react'

import { WRAPPER_HANDLERS } from 'components/interfaces/Integrations/Wrappers/Wrappers.constants'
import {
  convertKVStringArrayToJson,
  wrapperMetaComparator,
} from 'components/interfaces/Integrations/Wrappers/Wrappers.utils'
import { useSelectedProjectQuery } from './misc/useSelectedProject'

/**
 * A list of system schemas that users should not interact with
 */
export const INTERNAL_SCHEMAS = [
  'auth',
  'cron',
  'extensions',
  'information_schema',
  'net',
  'pgsodium',
  'pgsodium_masks',
  'pgbouncer',
  'pgtle',
  'realtime',
  'storage',
  'supabase_functions',
  'supabase_migrations',
  'vault',
  'graphql',
  'graphql_public',
]

/**
 * Returns a list of schemas that are protected by Supabase (internal schemas or schemas used by Iceberg FDWs).
 */
export const useProtectedSchemas = ({
  excludeSchemas = [],
}: { excludeSchemas?: string[] } = {}) => {
  // Stabilize the excludeSchemas array to prevent unnecessary re-computations
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableExcludeSchemas = useMemo(() => excludeSchemas, [JSON.stringify(excludeSchemas)])

  const schemas = useMemo<{ name: string; type: 'fdw' | 'internal' }[]>(() => {
    const internalSchemas = INTERNAL_SCHEMAS.map((s) => ({ name: s, type: 'internal' as const }))

    const schemas = uniq([...internalSchemas])
    return schemas.filter((schema) => !stableExcludeSchemas.includes(schema.name))
  }, [stableExcludeSchemas])

  return { data: schemas }
}

/**
 * Returns whether a given schema is protected by Supabase (internal schema or schema used by Iceberg FDWs).
 */
export const useIsProtectedSchema = ({
  schema,
  excludedSchemas = [],
}: {
  schema: string
  excludedSchemas?: string[]
}):
  | { isSchemaLocked: false; reason: undefined }
  | { isSchemaLocked: true; reason: 'fdw' | 'internal' } => {
  const { data: schemas } = useProtectedSchemas({ excludeSchemas: excludedSchemas })

  const foundSchema = schemas.find((s) => s.name === schema)

  if (foundSchema) {
    return {
      isSchemaLocked: true,
      reason: foundSchema.type,
    }
  }
  return { isSchemaLocked: false, reason: undefined }
}
