// Filter types for table data
export type FilterOperator =
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'LIKE'
  | 'ILIKE'
  | 'IN'
  | 'IS NULL'
  | 'IS NOT NULL'

export interface Filter {
  column: string
  operator: FilterOperator
  value: string
}

export const FILTER_OPERATORS: { value: FilterOperator; label: string; abbrev: string }[] = [
  { value: '=', label: 'equals', abbrev: 'eq' },
  { value: '!=', label: 'not equal', abbrev: 'neq' },
  { value: '>', label: 'greater than', abbrev: 'gt' },
  { value: '<', label: 'less than', abbrev: 'lt' },
  { value: '>=', label: 'greater than or equal', abbrev: 'gte' },
  { value: '<=', label: 'less than or equal', abbrev: 'lte' },
  { value: 'LIKE', label: 'like', abbrev: 'like' },
  { value: 'ILIKE', label: 'ilike (case insensitive)', abbrev: 'ilike' },
  { value: 'IN', label: 'in list', abbrev: 'in' },
  { value: 'IS NULL', label: 'is null', abbrev: 'null' },
  { value: 'IS NOT NULL', label: 'is not null', abbrev: 'notnull' },
]

// Helper to format filters to URL params
export function filtersToUrlParams(filters: Filter[]): string[] {
  return filters.map((filter) => {
    const operator = FILTER_OPERATORS.find((op) => op.value === filter.operator)
    return `${filter.column}:${operator?.abbrev}:${filter.value}`
  })
}

// Helper to parse filters from URL params
export function parseFiltersFromUrl(filterParams: string[]): Filter[] {
  return filterParams
    .map((param) => {
      const [column, operatorAbbrev, ...valueParts] = param.split(':')
      const value = valueParts.join(':') // Allow : in value
      const operator = FILTER_OPERATORS.find((op) => op.abbrev === operatorAbbrev)

      if (!column || !operatorAbbrev || !operator) return null

      return {
        column,
        operator: operator.value,
        value: value || '',
      } as Filter
    })
    .filter((f): f is Filter => f !== null)
}
