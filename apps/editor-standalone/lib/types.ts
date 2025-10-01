/**
 * Common types for the table editor
 */

export interface Table {
  id: number
  schema: string
  name: string
  comment?: string
  columns: Column[]
  primary_keys: PrimaryKey[]
  relationships: Relationship[]
}

export interface Column {
  id: string
  name: string
  table_id: number
  data_type: string
  format: string
  is_nullable: boolean
  is_unique: boolean
  is_identity: boolean
  is_updatable: boolean
  is_generated: boolean
  default_value?: string
  comment?: string
  enums?: string[]
  ordinal_position: number
}

export interface PrimaryKey {
  name: string
  schema: string
  table_name: string
  table_id: number
}

export interface Relationship {
  id: number
  constraint_name: string
  source_schema: string
  source_table_name: string
  source_column_name: string
  target_table_schema: string
  target_table_name: string
  target_column_name: string
}

export interface SupaRow {
  idx: number
  [key: string]: any
}

export interface Filter {
  column: string
  operator: string
  value: string
}

export interface Sort {
  column: string
  ascending: boolean
  nullsFirst?: boolean
}

export type Dictionary<T = any> = Record<string, T>
