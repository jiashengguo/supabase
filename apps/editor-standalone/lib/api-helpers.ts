import { getPostgresMetaUrl } from './supabase'

/**
 * API helpers for table row mutations (insert, update, delete)
 */

export interface UpdateRowParams {
  schema: string
  table: string
  primaryKey: string
  rowId: any
  updates: Record<string, any>
}

export interface InsertRowParams {
  schema: string
  table: string
  values: Record<string, any>
}

export interface DeleteRowsParams {
  schema: string
  table: string
  primaryKey: string
  rowIds: any[]
}

/**
 * Update a single row in the table
 */
export async function updateTableRow({
  schema,
  table,
  primaryKey,
  rowId,
  updates,
}: UpdateRowParams): Promise<void> {
  // Build SET clause
  const setClauses = Object.entries(updates).map(([key, value]) => {
    if (value === null) {
      return `"${key}" = NULL`
    }
    if (typeof value === 'string') {
      // Escape single quotes
      const escaped = value.replace(/'/g, "''")
      return `"${key}" = '${escaped}'`
    }
    if (typeof value === 'boolean') {
      return `"${key}" = ${value}`
    }
    if (typeof value === 'number') {
      return `"${key}" = ${value}`
    }
    if (typeof value === 'object') {
      const json = JSON.stringify(value).replace(/'/g, "''")
      return `"${key}" = '${json}'::jsonb`
    }
    return `"${key}" = '${value}'`
  })

  // Build WHERE clause
  const whereClause =
    typeof rowId === 'string'
      ? `"${primaryKey}" = '${rowId.replace(/'/g, "''")}'`
      : `"${primaryKey}" = ${rowId}`

  const query = `
    UPDATE ${schema}."${table}"
    SET ${setClauses.join(', ')}
    WHERE ${whereClause}
  `

  const url = `${getPostgresMetaUrl()}/query`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query.trim() }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to update row: ${error}`)
  }
}

/**
 * Insert a new row into the table
 */
export async function insertTableRow({ schema, table, values }: InsertRowParams): Promise<any> {
  const columns = Object.keys(values)
  const valueClauses = Object.values(values).map((value) => {
    if (value === null || value === undefined) {
      return 'NULL'
    }
    if (typeof value === 'string') {
      const escaped = value.replace(/'/g, "''")
      return `'${escaped}'`
    }
    if (typeof value === 'boolean') {
      return value.toString()
    }
    if (typeof value === 'number') {
      return value.toString()
    }
    if (typeof value === 'object') {
      const json = JSON.stringify(value).replace(/'/g, "''")
      return `'${json}'::jsonb`
    }
    return `'${value}'`
  })

  const query = `
    INSERT INTO ${schema}."${table}" (${columns.map((c) => `"${c}"`).join(', ')})
    VALUES (${valueClauses.join(', ')})
    RETURNING *
  `

  const url = `${getPostgresMetaUrl()}/query`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query.trim() }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to insert row: ${error}`)
  }

  const data = await response.json()
  return data[0] // Return the inserted row
}

/**
 * Delete multiple rows from the table
 */
export async function deleteTableRows({
  schema,
  table,
  primaryKey,
  rowIds,
}: DeleteRowsParams): Promise<number> {
  if (rowIds.length === 0) return 0

  // Build WHERE clause for multiple IDs
  const whereClauses = rowIds.map((id) => {
    if (typeof id === 'string') {
      return `"${primaryKey}" = '${id.replace(/'/g, "''")}'`
    }
    return `"${primaryKey}" = ${id}`
  })

  const query = `
    DELETE FROM ${schema}."${table}"
    WHERE ${whereClauses.join(' OR ')}
  `

  const url = `${getPostgresMetaUrl()}/query`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query.trim() }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete rows: ${error}`)
  }

  return rowIds.length
}
