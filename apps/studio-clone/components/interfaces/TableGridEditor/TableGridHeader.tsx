import React from 'react'
import { RefreshCw, Plus, Settings, Download, Filter, ArrowUpDown } from 'lucide-react'
import { EntitySummary } from 'data/entity-types/entity-types-infinite-query'

interface TableGridHeaderProps {
  table: EntitySummary
  isLoading?: boolean
  onRefresh?: () => void
  onAddRow?: () => void
  onExport?: () => void
  onFilter?: () => void
  onSort?: () => void
}

export const TableGridHeader = ({
  table,
  isLoading = false,
  onRefresh,
  onAddRow,
  onExport,
  onFilter,
  onSort,
}: TableGridHeaderProps) => {
  return (
    <div className="flex h-10 items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
      {/* Left side - Table info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">{table.name}</h1>
          <span className="text-xs text-gray-500 dark:text-gray-400">{table.schema}</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onFilter}
          className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Filter className="h-3 w-3 mr-1" />
          Filter
        </button>

        <button
          onClick={onSort}
          className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowUpDown className="h-3 w-3 mr-1" />
          Sort
        </button>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing' : 'Refresh'}
        </button>

        <button
          onClick={onExport}
          className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-3 w-3 mr-1" />
          Export
        </button>

        <button
          onClick={onAddRow}
          className="flex items-center px-2 py-1.5 text-xs font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add row
        </button>
      </div>
    </div>
  )
}
