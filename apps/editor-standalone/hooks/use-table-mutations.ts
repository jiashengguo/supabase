import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTableRow, insertTableRow, deleteTableRows } from '@/lib/api-helpers'
import type { Table } from '@/lib/types'

interface UseUpdateRowOptions {
  table: Table | null | undefined
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface UseInsertRowOptions {
  table: Table | null | undefined
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface UseDeleteRowsOptions {
  table: Table | null | undefined
  onSuccess?: (deletedCount: number) => void
  onError?: (error: Error) => void
}

/**
 * Hook to update a single row in the table
 */
export function useUpdateRow({ table, onSuccess, onError }: UseUpdateRowOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ rowId, updates }: { rowId: any; updates: Record<string, any> }) => {
      if (!table) throw new Error('Table not loaded')

      const primaryKey = table.primary_keys?.[0]?.name
      if (!primaryKey) throw new Error('Table has no primary key')

      await updateTableRow({
        schema: table.schema,
        table: table.name,
        primaryKey,
        rowId,
        updates,
      })
    },
    onSuccess: () => {
      // Invalidate table rows query to refetch data
      queryClient.invalidateQueries({ queryKey: ['table-rows', table?.id] })
      queryClient.invalidateQueries({ queryKey: ['table-row-count', table?.id] })
      onSuccess?.()
    },
    onError: (error: Error) => {
      console.error('Failed to update row:', error)
      onError?.(error)
    },
  })
}

/**
 * Hook to insert a new row into the table
 */
export function useInsertRow({ table, onSuccess, onError }: UseInsertRowOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: Record<string, any>) => {
      if (!table) throw new Error('Table not loaded')

      return await insertTableRow({
        schema: table.schema,
        table: table.name,
        values,
      })
    },
    onSuccess: (newRow) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['table-rows', table?.id] })
      queryClient.invalidateQueries({ queryKey: ['table-row-count', table?.id] })
      onSuccess?.()
      return newRow
    },
    onError: (error: Error) => {
      console.error('Failed to insert row:', error)
      onError?.(error)
    },
  })
}

/**
 * Hook to delete multiple rows from the table
 */
export function useDeleteRows({ table, onSuccess, onError }: UseDeleteRowsOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (rowIds: any[]) => {
      if (!table) throw new Error('Table not loaded')

      const primaryKey = table.primary_keys?.[0]?.name
      if (!primaryKey) throw new Error('Table has no primary key')

      return await deleteTableRows({
        schema: table.schema,
        table: table.name,
        primaryKey,
        rowIds,
      })
    },
    onSuccess: (deletedCount) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['table-rows', table?.id] })
      queryClient.invalidateQueries({ queryKey: ['table-row-count', table?.id] })
      onSuccess?.(deletedCount)
    },
    onError: (error: Error) => {
      console.error('Failed to delete rows:', error)
      onError?.(error)
    },
  })
}
