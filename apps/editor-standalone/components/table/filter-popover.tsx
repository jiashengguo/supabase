'use client'

import { useState } from 'react'
import { Filter as FilterIcon, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Filter, FilterOperator, FILTER_OPERATORS } from '@/lib/types/filters'
import type { Column } from '@/lib/types'

interface FilterPopoverProps {
  columns: Column[]
  onAddFilter: (filter: Filter) => void
}

export function FilterPopover({ columns, onAddFilter }: FilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator>('=')
  const [filterValue, setFilterValue] = useState('')

  const handleAddFilter = () => {
    if (!selectedColumn) return

    // For NULL operators, no value is needed
    const value =
      selectedOperator === 'IS NULL' || selectedOperator === 'IS NOT NULL' ? '' : filterValue

    onAddFilter({
      column: selectedColumn,
      operator: selectedOperator,
      value,
    })

    // Reset form
    setSelectedColumn('')
    setSelectedOperator('=')
    setFilterValue('')
    setOpen(false)
  }

  const isNullOperator = selectedOperator === 'IS NULL' || selectedOperator === 'IS NOT NULL'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
          <FilterIcon className="h-4 w-4 mr-2" />
          Add Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Add Filter</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Column Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Column</label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{col.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{col.format}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operator Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Operator</label>
              <Select
                value={selectedOperator}
                onValueChange={(value) => setSelectedOperator(value as FilterOperator)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPERATORS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value Input (hidden for NULL operators) */}
            {!isNullOperator && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Value</label>
                <Input
                  placeholder="Enter value..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddFilter()
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddFilter} disabled={!selectedColumn}>
              <Plus className="h-4 w-4 mr-1" />
              Add Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
