import { useSelectedProjectQuery, useParams } from 'hooks/useSelectedProject'
import { useTableEditorQuery } from 'data/table-editor/table-editor-query'
import { useTableSelection } from 'lib/table-selection-context'
import { useTableDataQuery } from 'data/table-data/table-data-query'
import { TableDataGrid } from './TableDataGrid'
import { TableGridHeader } from './TableGridHeader'
import { TableGridPagination } from './TableGridPagination'
import { TableViewTabs } from './TableViewTabs'
import { TableDefinitionView } from './TableDefinitionView'
import { useState, useEffect } from 'react'

export interface TableGridEditorProps {
  isLoadingSelectedTable?: boolean
  selectedTable?: any
}

export const TableGridEditor = ({
  isLoadingSelectedTable,
  selectedTable: propSelectedTable,
}: TableGridEditorProps) => {
  const { selectedTable: contextSelectedTable, selectedTableId } = useTableSelection()
  const { data: project } = useSelectedProjectQuery()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [activeView, setActiveView] = useState<'data' | 'definition'>('data')

  const { data: selectedTable, isLoading } = useTableEditorQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
    id: selectedTableId || undefined,
  })

  const table = propSelectedTable || contextSelectedTable || selectedTable
  const loading = isLoadingSelectedTable || isLoading

  // Get real table data from the API
  const { data: tableData, isLoading: isLoadingTableData } = useTableDataQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
    tableId: table?.id,
    tableName: table?.name,
    schema: table?.schema || 'public',
    page: currentPage,
    limit: rowsPerPage,
  })

  const columns = tableData?.columns || []
  const rows = tableData?.rows || []
  const totalRows = tableData?.totalCount || 0

  // Reset page when table changes
  useEffect(() => {
    setCurrentPage(1)
  }, [table?.id])

  if (loading) {
    return (
      <div className="flex-1 bg-white p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a table</h2>
          <p className="text-gray-600">
            Choose a table from the sidebar to view and edit its data.
          </p>
        </div>
      </div>
    )
  }

  const handleRefresh = () => {
    // Refresh table data
    window.location.reload()
  }

  const handleAddRow = () => {
    // TODO: Implement add row functionality
    console.log('Add row clicked')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export clicked')
  }

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked')
  }

  const handleSort = () => {
    // TODO: Implement sort functionality
    console.log('Sort clicked')
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(1) // Reset to first page when changing rows per page
  }

  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      {/* Header */}
      <TableGridHeader
        table={table}
        isLoading={isLoadingTableData}
        onRefresh={handleRefresh}
        onAddRow={handleAddRow}
        onExport={handleExport}
        onFilter={handleFilter}
        onSort={handleSort}
      />

      {/* View Tabs */}
      <TableViewTabs activeView={activeView} onViewChange={setActiveView} tableName={table.name} />

      {/* Table content */}
      <div className="flex-1 flex flex-col">
        {activeView === 'data' ? (
          <>
            <div className="flex-1">
              <TableDataGrid
                tableName={table.name}
                columns={columns}
                rows={rows}
                isLoading={isLoadingTableData}
              />
            </div>

            {/* Pagination */}
            {totalRows > 0 && (
              <TableGridPagination
                currentPage={currentPage}
                totalRows={totalRows}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            )}
          </>
        ) : (
          <TableDefinitionView tableName={table.name} schema={table.schema} columns={columns} />
        )}
      </div>
    </div>
  )
}
