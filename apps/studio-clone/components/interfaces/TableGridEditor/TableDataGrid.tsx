import React, { useMemo, useState } from 'react'
import DataGrid, { Column } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import { TableColumn } from 'data/table-data/table-data-query'

interface TableRow {
  [key: string]: any
}

interface TableDataGridProps {
  tableName: string
  columns: TableColumn[]
  rows: TableRow[]
  isLoading?: boolean
}

export function TableDataGrid({ tableName, columns, rows, isLoading = false }: TableDataGridProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  // Convert table columns to react-data-grid columns
  const gridColumns: Column<TableRow>[] = useMemo(() => {
    return columns.map((col) => ({
      key: col.name,
      name: col.name,
      width: 200,
      minWidth: 120,
      resizable: true,
      sortable: true,
      editable: true,
      renderHeaderCell: () => (
        <div className="flex flex-col py-1">
          <div className="flex items-center space-x-1">
            <span className="font-medium text-sm">{col.name}</span>
            {!col.is_nullable && <span className="text-red-500 text-xs">*</span>}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500 uppercase font-mono bg-gray-100 px-1 rounded">
              {col.data_type}
            </span>
            {col.is_identity && (
              <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">ID</span>
            )}
            {col.default_value && (
              <span className="text-xs text-green-600" title={`Default: ${col.default_value}`}>
                DEF
              </span>
            )}
          </div>
        </div>
      ),
      renderCell: ({ row, column }) => {
        const value = row[column.key]
        const columnInfo = columns.find((c) => c.name === column.key)

        if (value === null) {
          return <span className="text-gray-400 italic bg-gray-50 px-1 rounded text-xs">NULL</span>
        }

        if (value === undefined || value === '') {
          return <span className="text-gray-300">—</span>
        }

        // Handle different data types based on column type
        const dataType = columnInfo?.data_type?.toLowerCase() || ''

        if (dataType.includes('bool')) {
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {String(value)}
            </span>
          )
        }

        if (
          dataType.includes('int') ||
          dataType.includes('numeric') ||
          dataType.includes('decimal')
        ) {
          return <span className="font-mono text-blue-600">{value}</span>
        }

        if (dataType.includes('timestamp') || dataType.includes('date')) {
          const dateValue = new Date(value)
          return (
            <span className="text-purple-600 text-sm" title={dateValue.toISOString()}>
              {dateValue.toLocaleString()}
            </span>
          )
        }

        if (dataType.includes('json')) {
          const jsonStr = typeof value === 'object' ? JSON.stringify(value) : String(value)
          return (
            <span className="font-mono text-orange-600 text-sm" title={jsonStr}>
              {jsonStr.length > 50 ? jsonStr.substring(0, 50) + '...' : jsonStr}
            </span>
          )
        }

        // String values - truncate if too long
        const stringValue = String(value)
        if (stringValue.length > 80) {
          return (
            <span title={stringValue} className="cursor-help">
              {stringValue.substring(0, 80)}...
            </span>
          )
        }

        return <span className="text-gray-900">{stringValue}</span>
      },
    }))
  }, [columns])

  // Add row indices to the data for selection - MUST be before any conditional returns
  const rowsWithIndices = useMemo(
    () => rows.map((row, index) => ({ ...row, __rowIndex: index })),
    [rows]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading table data...</span>
      </div>
    )
  }

  if (columns.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No columns found</h3>
          <p className="text-gray-600">This table doesn't have any columns defined.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <div className="h-full border-t border-gray-200 overflow-hidden">
        <DataGrid
          columns={gridColumns}
          rows={rowsWithIndices}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          rowKeyGetter={(row) => row.__rowIndex}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          onRowsChange={(newRows) => {
            // Handle row changes here
            console.log('Rows changed:', newRows)
          }}
          className="rdg-light" // Use light theme
          style={{ height: '100%' }}
        />
      </div>

      {/* Selection info */}
      {selectedRows.size > 0 && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
          <span className="text-sm text-blue-700">
            {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}
    </div>
  )
}
