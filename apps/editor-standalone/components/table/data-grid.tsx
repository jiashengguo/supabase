'use client'

import { useMemo, useState, useCallback } from 'react'
import DataGrid, { type SortColumn } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import { useTable } from '@/hooks/use-tables'
import { useTableRows, useTableRowCount, type TableRow } from '@/hooks/use-table-rows'
import { useInsertRow, useDeleteRows } from '@/hooks/use-table-mutations'
import { useTableFilters } from '@/hooks/use-table-filters'
import { columnsToGridColumns } from '@/lib/grid-helpers'
import { PaginationControls } from './pagination-controls'
import { TableToolbar } from './table-toolbar'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface TableDataGridProps {
  tableId: number
}

export function TableDataGrid({ tableId }: TableDataGridProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(new Set())

  // Filter state management
  const { filters, addFilter, removeFilter, clearFilters } = useTableFilters()

  const { data: table, isLoading: tableLoading } = useTable(tableId)
  const {
    data: rowsData,
    isLoading: rowsLoading,
    error,
    refetch,
  } = useTableRows(tableId, table?.schema, table?.name, {
    page,
    pageSize,
    sortBy: sortColumns[0]?.columnKey,
    sortOrder: sortColumns[0]?.direction === 'ASC' ? 'asc' : 'desc',
    filters,
  })
  const { data: totalRows = 0 } = useTableRowCount(tableId, table?.schema, table?.name, filters)

  // Mutations
  const insertRowMutation = useInsertRow({
    table,
    onSuccess: () => {
      toast.success('Row inserted successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to insert row: ${error.message}`)
    },
  })

  const deleteRowsMutation = useDeleteRows({
    table,
    onSuccess: (count) => {
      toast.success(`${count} row${count > 1 ? 's' : ''} deleted successfully`)
      setSelectedRows(new Set())
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to delete rows: ${error.message}`)
    },
  })

  // Convert database columns to grid columns
  const gridColumns = useMemo(() => {
    if (!table?.columns) return []
    return columnsToGridColumns(table.columns)
  }, [table?.columns])

  // Rows are already sorted by the database query, just use them directly
  const rows = useMemo(() => {
    return rowsData?.rows || []
  }, [rowsData?.rows])

  // Handle insert row
  const handleInsertRow = useCallback(() => {
    if (!table?.columns) return

    // Create empty row with default/null values
    // Skip columns with database-generated defaults (like gen_random_uuid(), etc.)
    const newRow: Record<string, any> = {}
    table.columns.forEach((col) => {
      // Skip columns with function defaults that generate IDs (they will be set by the database)
      if (col.default_value && col.default_value.includes('()')) {
        return // Let the database handle function calls like gen_random_uuid()
      }

      // Check if column is a foreign key
      const isForeignKey = table.relationships?.some(
        (rel) =>
          rel.source_schema === table.schema &&
          rel.source_table_name === table.name &&
          rel.source_column_name === col.name
      )

      if (col.default_value) {
        // Use the default value as-is (but skip CURRENT_TIMESTAMP - we'll use NOW())
        if (col.default_value.toUpperCase().includes('CURRENT_TIMESTAMP')) {
          newRow[col.name] = new Date().toISOString()
        } else {
          newRow[col.name] = col.default_value
        }
      } else if (!col.is_nullable) {
        // Required field - set appropriate default based on type
        if (col.format === 'timestamptz' || col.format === 'timestamp') {
          // For required timestamp columns without defaults, use current timestamp
          newRow[col.name] = new Date().toISOString()
        } else if (isForeignKey) {
          // For foreign keys, we can't set a valid default - skip this column
          // This will cause insertion to fail if the FK is NOT NULL
          return
        } else if (col.format === 'int' || col.format === 'int4' || col.format === 'int8') {
          newRow[col.name] = 0
        } else if (col.format === 'bool') {
          newRow[col.name] = false
        } else if (col.enums && col.enums.length > 0) {
          // Use first enum value as default
          newRow[col.name] = col.enums[0]
        } else {
          newRow[col.name] = ''
        }
      } else {
        // Nullable columns get NULL
        newRow[col.name] = null
      }
    })

    insertRowMutation.mutate(newRow)
  }, [table?.columns, table?.relationships, table?.schema, table?.name, insertRowMutation])

  // Handle delete rows
  const handleDeleteRows = useCallback(() => {
    if (!table?.primary_keys?.[0]?.name) return

    const primaryKey = table.primary_keys[0].name
    const rowIdsToDelete: any[] = []

    // Get primary key values for selected rows
    Array.from(selectedRows).forEach((rowHash) => {
      const row = rows.find((r) => {
        // Match by hash
        const str = String(r[primaryKey])
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          hash = (hash << 5) - hash + str.charCodeAt(i)
          hash = hash & hash
        }
        return hash === rowHash
      })
      if (row && row[primaryKey]) {
        rowIdsToDelete.push(row[primaryKey])
      }
    })

    if (rowIdsToDelete.length > 0) {
      deleteRowsMutation.mutate(rowIdsToDelete)
    }
  }, [selectedRows, rows, table?.primary_keys, deleteRowsMutation])

  // Loading state
  if (tableLoading || rowsLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading table data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-red-800">Failed to load table data</p>
          <p className="text-xs text-red-600 mt-1">{error.message}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!rows || rows.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <TableToolbar
          columns={table?.columns || []}
          filters={filters}
          onAddFilter={addFilter}
          onRemoveFilter={removeFilter}
          onClearFilters={clearFilters}
          selectedRowCount={0}
          onInsertRow={handleInsertRow}
          onDeleteRows={handleDeleteRows}
          isDeleting={deleteRowsMutation.isPending}
        />
        <div className="flex items-center justify-center h-96 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600">No rows in this table</p>
            <p className="text-xs text-gray-500 mt-1">Click "Insert Row" to add data</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <TableToolbar
        columns={table?.columns || []}
        filters={filters}
        onAddFilter={addFilter}
        onRemoveFilter={removeFilter}
        onClearFilters={clearFilters}
        selectedRowCount={selectedRows.size}
        onInsertRow={handleInsertRow}
        onDeleteRows={handleDeleteRows}
        isDeleting={deleteRowsMutation.isPending}
      />

      <DataGrid
        columns={gridColumns}
        rows={rows}
        rowKeyGetter={(row: TableRow) => {
          // Try to use primary key column
          const primaryKey = table?.primary_keys?.[0]?.name
          if (primaryKey && row[primaryKey] !== undefined) {
            const pkValue = row[primaryKey]
            // If PK is already a number, use it
            if (typeof pkValue === 'number') return pkValue
            // Convert string to simple hash number
            const str = String(pkValue)
            let hash = 0
            for (let i = 0; i < str.length; i++) {
              hash = (hash << 5) - hash + str.charCodeAt(i)
              hash = hash & hash // Convert to 32bit integer
            }
            return hash
          }
          // Fall back to stringifying entire row and hashing
          const str = JSON.stringify(row)
          let hash = 0
          for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i)
            hash = hash & hash
          }
          return hash
        }}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        className="rdg-light"
        style={{ height: '600px' }}
        rowHeight={35}
        headerRowHeight={40}
      />

      {/* Pagination Controls */}
      {totalRows > 0 && (
        <PaginationControls
          currentPage={page}
          totalRows={totalRows}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setPage(1) // Reset to first page when changing page size
          }}
        />
      )}
    </div>
  )
}
