'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Filter, FILTER_OPERATORS } from '@/lib/types/filters'

interface FilterChipProps {
  filter: Filter
  onRemove: () => void
  onClick?: () => void
}

export function FilterChip({ filter, onRemove, onClick }: FilterChipProps) {
  const operator = FILTER_OPERATORS.find((op) => op.value === filter.operator)
  const operatorLabel = operator?.label || filter.operator

  const displayValue =
    filter.operator === 'IS NULL' || filter.operator === 'IS NOT NULL' ? '' : filter.value

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
      onClick={onClick}
    >
      <span className="font-semibold">{filter.column}</span>
      <span className="text-blue-500">{operatorLabel}</span>
      {displayValue && <span className="font-mono">{displayValue}</span>}
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 ml-1 hover:bg-blue-200 rounded-full"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
