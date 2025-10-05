import { SupaTable } from 'components/grid/types'

export const formatTableRowsToSQL = (table: SupaTable, rows: any[]) => {
  if (rows.length === 0) return ''

  const columns = table.columns.map((col) => `"${col.name}"`).join(', ')

  const valuesSets = rows
    .map((row) => {
      const filteredRow = { ...row }
      if ('idx' in filteredRow) delete filteredRow.idx

      const values = Object.entries(filteredRow).map(([key, val]) => {
        const { dataType, format } = table.columns.find((col) => col.name === key) ?? {}

        // We only check for NULL, array and JSON types, everything else we stringify
        // given that Postgres can implicitly cast the right type based on the column type
        // For string types, we need to deal with escaping single quotes
        const stringFormats = ['text', 'varchar']

        if (val === null) {
          return 'null'
        } else if (dataType === 'ARRAY') {
          return `'${JSON.stringify(val).replace('[', '{').replace(/.$/, '}')}'`
        } else if (format?.includes('json')) {
          return `${JSON.stringify(val).replace(/\\"/g, '"').replace(/'/g, "''").replace('"', "'").replace(/.$/, "'")}`
        } else if (
          typeof format === 'string' &&
          typeof val === 'string' &&
          stringFormats.includes(format)
        ) {
          return `'${val.replaceAll("'", "''")}'`
        } else {
          return `'${val}'`
        }
      })

      return `(${values.join(', ')})`
    })
    .join(', ')

  return `INSERT INTO "${table.schema}"."${table.name}" (${columns}) VALUES ${valuesSets};`
}
