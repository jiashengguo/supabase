import { ENTITY_TYPE } from 'data/entity-types/entity-type-constants'

// Simplified types to avoid complex dependencies for now
interface PostgresColumn {
  id: string
  table_id: number
  schema: string
  table: string
  name: string
  ordinal_position: number
  default_value?: string
  data_type: string
  format: string
  is_identity: boolean
  identity_generation?: string
  is_nullable: boolean
  is_updatable: boolean
  is_unique: boolean
  enums: string[]
  check?: string
  comment?: string
}

interface PostgresRelationship {
  id: number
  constraint_name: string
  source_schema: string
  source_table_name: string
  source_column_name: string
  target_table_schema: string
  target_table_name: string
  target_column_name: string
}

interface PostgresTable {
  id: number
  schema: string
  name: string
  rls_enabled: boolean
  rls_forced: boolean
  replica_identity: string
  bytes: number
  size: string
  live_rows_estimate: number
  dead_rows_estimate: number
  comment?: string
  columns?: PostgresColumn[]
  relationships?: PostgresRelationship[]
}

interface PostgresView {
  id: number
  schema: string
  name: string
  definition: string
  comment?: string
  columns?: PostgresColumn[]
}

interface PostgresMaterializedView {
  id: number
  schema: string
  name: string
  definition: string
  comment?: string
  columns?: PostgresColumn[]
}

interface TableRelationship extends PostgresRelationship {
  deletion_action: 'a' | 'r' | 'c' | 'n' | 'd'
  update_action: 'a' | 'r' | 'c' | 'n' | 'd'
}

export interface Table extends PostgresTable {
  entity_type: ENTITY_TYPE.TABLE
  columns: PostgresColumn[]
  relationships: TableRelationship[]
}

export interface PartitionedTable extends PostgresTable {
  entity_type: ENTITY_TYPE.PARTITIONED_TABLE
  columns: PostgresColumn[]
  relationships: TableRelationship[]
}

export interface View extends PostgresView {
  entity_type: ENTITY_TYPE.VIEW
  columns: PostgresColumn[]
}

export interface MaterializedView extends PostgresMaterializedView {
  entity_type: ENTITY_TYPE.MATERIALIZED_VIEW
  columns: PostgresColumn[]
}

export interface ForeignTable {
  entity_type: ENTITY_TYPE.FOREIGN_TABLE
  id: number
  schema: string
  name: string
  comment: string | null
  columns: PostgresColumn[]
}

export type Entity = Table | PartitionedTable | View | MaterializedView | ForeignTable

export type TableLike = Table | PartitionedTable

export function isTable(entity?: Entity): entity is Table {
  return entity?.entity_type === ENTITY_TYPE.TABLE
}

export function isPartitionedTable(entity?: Entity): entity is PartitionedTable {
  return entity?.entity_type === ENTITY_TYPE.PARTITIONED_TABLE
}

export function isTableLike(entity?: Entity): entity is TableLike {
  return isTable(entity) || isPartitionedTable(entity)
}

export function isForeignTable(entity?: Entity): entity is ForeignTable {
  return entity?.entity_type === ENTITY_TYPE.FOREIGN_TABLE
}

export function isView(entity?: Entity): entity is View {
  return entity?.entity_type === ENTITY_TYPE.VIEW
}

export function isMaterializedView(entity?: Entity): entity is MaterializedView {
  return entity?.entity_type === ENTITY_TYPE.MATERIALIZED_VIEW
}

export function isViewLike(entity?: Entity): entity is View | MaterializedView {
  return isView(entity) || isMaterializedView(entity)
}
