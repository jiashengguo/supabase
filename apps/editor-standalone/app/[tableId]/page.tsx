'use client'

import { use, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { useTable } from '@/hooks/use-tables'
import { useRecentTables } from '@/hooks/use-recent-tables'
import { TableDataGrid } from '@/components/table/data-grid'
import { Loader2 } from 'lucide-react'

export default function TablePage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId: tableIdStr } = use(params)
  const tableId = parseInt(tableIdStr, 10)
  const { data: table, isLoading, error } = useTable(tableId)
  const { addRecentTable } = useRecentTables()

  // Track recently visited table
  useEffect(() => {
    if (table) {
      addRecentTable({
        id: table.id,
        name: table.name,
        schema: table.schema,
      })
    }
  }, [table, addRecentTable])

  return (
    <AppLayout>
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm md:text-base">Error loading table: {error.message}</p>
        </div>
      )}

      {table && (
        <div>
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{table.name}</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Schema: {table.schema} • {table.columns?.length || 0} columns
            </p>
          </div>

          <TableDataGrid tableId={table.id} />
        </div>
      )}
    </AppLayout>
  )
}
