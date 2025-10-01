import type { Column as DataGridColumn } from 'react-data-grid'
import type { Column } from './types'

export interface GridColumn extends DataGridColumn<any> {
  key: string
  name: string
  resizable?: boolean
  sortable?: boolean
  frozen?: boolean
}

/**
 * Maps a database column to a react-data-grid column
 */
export function mapColumnToGridColumn(column: Column): GridColumn {
  const isNumeric = [
    'int2',
    'int4',
    'int8',
    'float4',
    'float8',
    'numeric',
    'decimal',
    'smallint',
    'integer',
    'bigint',
    'real',
    'double precision',
  ].includes(column.format)

  const isBoolean = column.format === 'bool' || column.format === 'boolean'
  const isDate = ['date', 'timestamp', 'timestamptz', 'time', 'timetz'].includes(column.format)
  const isJson = ['json', 'jsonb'].includes(column.format)

  return {
    key: column.name,
    name: column.name,
    resizable: true,
    sortable: true,
    width: isBoolean ? 100 : isNumeric ? 120 : 200,
    formatter: ({ row }) => {
      const value = row[column.name]

      // Handle null/undefined
      if (value === null) {
        return <span className="text-gray-400 italic">NULL</span>
      }
      if (value === undefined) {
        return <span className="text-gray-400 italic">-</span>
      }

      // Handle objects (including arrays, dates, etc.)
      if (typeof value === 'object' && value !== null) {
        try {
          const jsonString = JSON.stringify(value)
          return (
            <span className="font-mono text-xs text-blue-600">
              {jsonString.length > 100 ? jsonString.substring(0, 100) + '...' : jsonString}
            </span>
          )
        } catch {
          return <span className="text-gray-400 italic">[Object]</span>
        }
      }

      // Format based on type
      if (isBoolean) {
        return (
          <span className={value ? 'text-green-600' : 'text-gray-500'}>
            {value ? 'true' : 'false'}
          </span>
        )
      }

      if (isDate && value) {
        try {
          return new Date(value).toLocaleString()
        } catch {
          return String(value)
        }
      }

      if (isJson || typeof value === 'object') {
        try {
          const jsonString = typeof value === 'string' ? value : JSON.stringify(value)
          return <span className="font-mono text-xs text-blue-600">{jsonString}</span>
        } catch {
          return String(value)
        }
      }

      if (isNumeric) {
        return <span className="font-mono text-right block">{value.toLocaleString()}</span>
      }

      // Default: string
      const stringValue = String(value)
      if (stringValue.length > 100) {
        return (
          <span className="truncate" title={stringValue}>
            {stringValue.substring(0, 100)}...
          </span>
        )
      }

      return stringValue
    },
  }
}

/**
 * Converts database columns to grid columns
 */
export function columnsToGridColumns(columns: Column[]): GridColumn[] {
  if (!columns || columns.length === 0) return []

  // Sort columns: primary keys first, then alphabetical
  const sortedColumns = [...columns].sort((a, b) => {
    if (a.is_identity && !b.is_identity) return -1
    if (!a.is_identity && b.is_identity) return 1
    return a.name.localeCompare(b.name)
  })

  return sortedColumns.map(mapColumnToGridColumn)
}

/**
 * Formats a cell value for display
 */
export function formatCellValue(value: any, format: string): string {
  if (value === null) return 'NULL'
  if (value === undefined) return '-'

  const isDate = ['date', 'timestamp', 'timestamptz', 'time', 'timetz'].includes(format)
  const isJson = ['json', 'jsonb'].includes(format)

  if (isDate) {
    try {
      return new Date(value).toLocaleString()
    } catch {
      return String(value)
    }
  }

  if (isJson) {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  return String(value)
}
