'use client'

import Link from 'next/link'
import { useTables } from '@/hooks/use-tables'
import { Database, Loader2, Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { data: tables, isLoading, error } = useTables('public')

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          <h2 className="font-semibold text-gray-900">Tables</h2>
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-600">Failed to load tables: {error.message}</div>
        )}

        {tables && tables.length === 0 && (
          <div className="p-4 text-sm text-gray-500">No tables found</div>
        )}

        {tables && tables.length > 0 && (
          <div className="space-y-1">
            {tables.map((table) => (
              <Link
                key={table.id}
                href={`/${table.id}`}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
                  'hover:bg-gray-200 transition-colors',
                  'text-gray-700 hover:text-gray-900'
                )}
              >
                <Table2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{table.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        {tables && `${tables.length} table${tables.length !== 1 ? 's' : ''}`}
      </div>
    </aside>
  )
}
