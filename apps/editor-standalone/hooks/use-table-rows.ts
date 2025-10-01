import { useQuery } from '@tanstack/react-query'
import { getPostgresMetaUrl } from '@/lib/supabase'
import type { Filter } from '@/lib/types/filters'

export interface TableRow {
  [key: string]: any
}

export interface TableRowsResponse {
  rows: TableRow[]
  total: number
}

export interface UseTableRowsOptions {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Filter[]
}

/**
 * Convert filters to SQL WHERE clause
 */
function filtersToWhereClause(filters: Filter[]): string {
  if (!filters || filters.length === 0) return ''

  const conditions = filters.map((filter) => {
    const { column, operator, value } = filter

    // Handle NULL operators
    if (operator === 'IS NULL') {
      return `"${column}" IS NULL`
    }
    if (operator === 'IS NOT NULL') {
      return `"${column}" IS NOT NULL`
    }

    // Escape single quotes in value
    const escapedValue = value.replace(/'/g, "''")

    // Handle different operators
    switch (operator) {
      case '=':
        return `"${column}" = '${escapedValue}'`
      case '!=':
        return `"${column}" != '${escapedValue}'`
      case '>':
        return `"${column}" > '${escapedValue}'`
      case '<':
        return `"${column}" < '${escapedValue}'`
      case '>=':
        return `"${column}" >= '${escapedValue}'`
      case '<=':
        return `"${column}" <= '${escapedValue}'`
      case 'LIKE':
        return `"${column}" LIKE '${escapedValue}'`
      case 'ILIKE':
        return `"${column}" ILIKE '${escapedValue}'`
      case 'IN':
        // Split by comma and trim
        const values = value.split(',').map((v) => `'${v.trim().replace(/'/g, "''")}'`)
        return `"${column}" IN (${values.join(', ')})`
      default:
        return `"${column}" = '${escapedValue}'`
    }
  })

  return ` WHERE ${conditions.join(' AND ')}`
}

export function useTableRows(
  tableId: number | undefined,
  schema: string = 'public',
  tableName: string | undefined,
  options: UseTableRowsOptions = {}
) {
  const { page = 1, pageSize = 100, sortBy, sortOrder = 'asc', filters = [] } = options

  return useQuery({
    queryKey: ['table-rows', tableId, page, pageSize, sortBy, sortOrder, filters],
    queryFn: async () => {
      if (!tableId || !tableName) throw new Error('Table ID and name are required')

      const offset = (page - 1) * pageSize

      // Build SQL query
      let query = `SELECT * FROM ${schema}."${tableName}"`

      // Add WHERE clause for filters
      query += filtersToWhereClause(filters)

      if (sortBy) {
        query += ` ORDER BY "${sortBy}" ${sortOrder.toUpperCase()}`
      }

      query += ` LIMIT ${pageSize} OFFSET ${offset}`

      const url = `${getPostgresMetaUrl()}/query`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch table rows')
      }

      const data = await response.json()

      return {
        rows: data as TableRow[],
        total: data.length,
      }
    },
    enabled: !!tableId && !!tableName,
    staleTime: 60 * 1000, // 1 minute
  })
}

// Hook to get total row count
export function useTableRowCount(
  tableId: number | undefined,
  schema: string = 'public',
  tableName: string | undefined,
  filters: Filter[] = []
) {
  return useQuery({
    queryKey: ['table-row-count', tableId, filters],
    queryFn: async () => {
      if (!tableId || !tableName) throw new Error('Table ID and name are required')

      let query = `SELECT COUNT(*) as count FROM ${schema}."${tableName}"`

      // Add WHERE clause for filters
      query += filtersToWhereClause(filters)

      const url = `${getPostgresMetaUrl()}/query`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch row count')
      }

      const data = await response.json()
      return data[0]?.count ? parseInt(data[0].count, 10) : 0
    },
    enabled: !!tableId && !!tableName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
