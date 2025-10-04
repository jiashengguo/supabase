export function getTableEditorSql(id?: number) {
  if (!id) return ''

  // Simplified SQL query for now - in real implementation this would be the complex SQL from studio
  return `
    SELECT 
      c.oid::int8 as id,
      nc.nspname as schema,
      c.relname as name,
      c.relkind,
      'TABLE' as entity_type
    FROM pg_class c
    JOIN pg_namespace nc ON nc.oid = c.relnamespace
    WHERE c.oid = ${id}
  `
}
