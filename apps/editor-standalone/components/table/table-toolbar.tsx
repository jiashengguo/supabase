'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Trash2, AlertTriangle, X } from 'lucide-react'
import { FilterPopover } from './filter-popover'
import { FilterChip } from './filter-chip'
import type { Column } from '@/lib/types'
import type { Filter } from '@/lib/types/filters'

interface TableToolbarProps {
  columns: Column[]
  filters: Filter[]
  onAddFilter: (filter: Filter) => void
  onRemoveFilter: (index: number) => void
  onClearFilters: () => void
  selectedRowCount: number
  onInsertRow: () => void
  onDeleteRows: () => void
  isDeleting?: boolean
}

export function TableToolbar({
  columns,
  filters,
  onAddFilter,
  onRemoveFilter,
  onClearFilters,
  selectedRowCount,
  onInsertRow,
  onDeleteRows,
  isDeleting = false,
}: TableToolbarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const hasFilters = filters.length > 0

  const handleDeleteClick = () => {
    if (selectedRowCount > 0) {
      setShowDeleteDialog(true)
    }
  }

  const handleConfirmDelete = () => {
    onDeleteRows()
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        {/* Main toolbar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <FilterPopover columns={columns} onAddFilter={onAddFilter} />

            <Button onClick={onInsertRow} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Insert Row
            </Button>

            <Button
              onClick={handleDeleteClick}
              variant="outline"
              size="sm"
              disabled={selectedRowCount === 0 || isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete {selectedRowCount > 0 ? `(${selectedRowCount})` : ''}
            </Button>
          </div>

          {selectedRowCount > 0 && (
            <div className="text-sm text-gray-600">
              {selectedRowCount} row{selectedRowCount > 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((filter, index) => (
                <FilterChip key={index} filter={filter} onRemove={() => onRemoveFilter(index)} />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <DialogTitle>
                Delete {selectedRowCount} Row{selectedRowCount > 1 ? 's' : ''}?
              </DialogTitle>
            </div>
            <DialogDescription>
              This action cannot be undone. {selectedRowCount === 1 ? 'This row' : 'These rows'}{' '}
              will be permanently deleted from the database.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
