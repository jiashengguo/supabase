import { useQuery } from '@tanstack/react-query'
import { getPostgresMetaUrl } from '@/lib/supabase'
import type { Table } from '@/lib/types'

interface TablesResponse {
  data: Table[]
  error?: { message: string }
}

async function fetchTables(schema: string = 'public'): Promise<Table[]> {
  const metaUrl = getPostgresMetaUrl()
  const response = await fetch(`${metaUrl}/tables?included_schemas=${schema}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch tables: ${response.statusText}`)
  }

  const data: Table[] = await response.json()
  return data
}

export function useTables(schema: string = 'public') {
  return useQuery({
    queryKey: ['tables', schema],
    queryFn: () => fetchTables(schema),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useTable(tableId: number | undefined) {
  return useQuery({
    queryKey: ['table', tableId],
    queryFn: async () => {
      if (!tableId) return null

      const metaUrl = getPostgresMetaUrl()
      const response = await fetch(`${metaUrl}/tables?id=${tableId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch table: ${response.statusText}`)
      }

      const data: Table[] = await response.json()
      // API returns all tables, need to filter by ID
      return data.find((table) => table.id === tableId) || null
    },
    enabled: !!tableId,
    staleTime: 5 * 60 * 1000,
  })
}
