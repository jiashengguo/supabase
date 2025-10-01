export const LOCAL_STORAGE_KEYS = {
  RECENTLY_VISITED_TABLES: 'supabase-editor-recent-tables',
  GRID_STATE: 'supabase-editor-grid-state',
}

export const TABLE_EDITOR_DEFAULT_ROWS_PER_PAGE = 100

export const FILTER_OPERATORS = {
  equals: '=',
  notEquals: '!=',
  greaterThan: '>',
  lessThan: '<',
  like: 'LIKE',
  ilike: 'ILIKE',
  in: 'IN',
  isNull: 'IS NULL',
  isNotNull: 'IS NOT NULL',
} as const

export const SORT_DIRECTIONS = {
  asc: 'asc',
  desc: 'desc',
} as const
