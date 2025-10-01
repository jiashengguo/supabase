'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTables } from '@/hooks/use-tables'
import { useSchemas } from '@/hooks/use-schemas'
import { useRecentTables } from '@/hooks/use-recent-tables'
import { Database, Table2, Clock, Search, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { TableListSkeleton } from '@/components/ui/skeleton'

export function EnhancedSidebar() {
  const pathname = usePathname()
  const [selectedSchema, setSelectedSchema] = useState('public')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: schemas, isLoading: schemasLoading } = useSchemas()
  const { data: tables, isLoading: tablesLoading, error } = useTables(selectedSchema)
  const { recentTables } = useRecentTables()

  // Memoize search icon to prevent unnecessary re-renders
  const searchIcon = useMemo(() => <Search className="w-4 h-4 text-gray-400" />, [])

  // Filter tables based on search query
  const filteredTables = useMemo(() => {
    if (!tables) return []
    if (!searchQuery.trim()) return tables

    const query = searchQuery.toLowerCase()
    return tables.filter(
      (table) =>
        table.name.toLowerCase().includes(query) || table.comment?.toLowerCase().includes(query)
    )
  }, [tables, searchQuery])

  // Filter recent tables to show only from current schema
  const recentTablesInSchema = useMemo(() => {
    return recentTables.filter((t) => t.schema === selectedSchema)
  }, [recentTables, selectedSchema])

  const isTableActive = (tableId: number) => {
    return pathname === `/${tableId}`
  }

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col md:flex">
      {/* Header with Schema Selector and Search */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        {/* Schema Selector - Using native select due to React 19 compatibility issues with Radix UI */}
        <div>
          <label htmlFor="schema-select" className="text-xs font-medium text-gray-600 mb-1 block">
            Schema
          </label>
          <select
            id="schema-select"
            value={selectedSchema}
            onChange={(e) => setSelectedSchema(e.target.value)}
            className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {(schemas || []).map((schema) => (
              <option key={schema.name} value={schema.name}>
                {schema.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div>
          {/* @ts-expect-error - React 19 compatibility pending Radix UI update */}
          <Input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={searchIcon}
          />
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto">
        {tablesLoading && <TableListSkeleton />}

        {error && (
          <div className="p-4 m-2 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Failed to load tables</p>
                <p className="text-xs mt-1 text-red-600">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {!tablesLoading && !error && (
          <>
            {/* Recent Tables Section */}
            {recentTablesInSchema.length > 0 && !searchQuery && (
              <div className="pt-2 pb-3 px-2">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <Clock className="w-3 h-3" />
                  Recent
                </div>
                <div className="space-y-0.5 mt-1">
                  {recentTablesInSchema.map((table) => (
                    <Link
                      key={table.id}
                      href={`/${table.id}`}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                        isTableActive(table.id)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                      )}
                    >
                      <Table2 className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{table.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Tables Section */}
            {filteredTables.length > 0 && (
              <div className="pt-2 pb-3 px-2">
                {recentTablesInSchema.length > 0 && !searchQuery && (
                  <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    All Tables
                  </div>
                )}
                <div className="space-y-0.5 mt-1">
                  {filteredTables.map((table) => (
                    <Link
                      key={table.id}
                      href={`/${table.id}`}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                        isTableActive(table.id)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                      )}
                    >
                      <Table2 className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{table.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty States */}
            {filteredTables.length === 0 && tables && tables.length > 0 && searchQuery && (
              <div className="p-4 text-center text-sm text-gray-500">
                <p>No tables match "{searchQuery}"</p>
              </div>
            )}

            {tables && tables.length === 0 && !searchQuery && (
              <div className="p-4 text-center text-sm text-gray-500">
                <p>No tables in schema "{selectedSchema}"</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        {tables && (
          <div className="space-y-1">
            <div>
              {filteredTables.length} {searchQuery ? 'matching' : ''} table
              {filteredTables.length !== 1 ? 's' : ''}
            </div>
            {searchQuery && filteredTables.length !== tables.length && (
              <div className="text-gray-400">of {tables.length} total</div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
