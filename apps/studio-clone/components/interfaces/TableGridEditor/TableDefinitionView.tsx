import React from 'react'
import { TableColumn } from 'data/table-data/table-data-query'

interface TableDefinitionViewProps {
  tableName: string
  schema: string
  columns: TableColumn[]
}

export const TableDefinitionView = ({ tableName, schema, columns }: TableDefinitionViewProps) => {
  const generateSQL = () => {
    let sql = `CREATE TABLE "${schema}"."${tableName}" (\n`

    const columnDefinitions = columns.map((col) => {
      let definition = `  "${col.name}" ${col.data_type}`

      if (!col.is_nullable) {
        definition += ' NOT NULL'
      }

      if (col.default_value) {
        definition += ` DEFAULT ${col.default_value}`
      }

      return definition
    })

    sql += columnDefinitions.join(',\n')
    sql += '\n);'

    return sql
  }

  return (
    <div className="p-6 bg-white h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Table Definition: {tableName}</h2>
        <p className="text-sm text-gray-600">Schema: {schema}</p>
      </div>

      {/* Columns Information */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-900 mb-4">Columns ({columns.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nullable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {columns.map((column, index) => (
                <tr key={column.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{column.name}</span>
                      {!column.is_nullable && <span className="ml-2 text-xs text-red-600">*</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {column.data_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.default_value ? (
                      <code className="bg-yellow-100 text-yellow-800 px-1 rounded text-xs">
                        {column.default_value}
                      </code>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        column.is_nullable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {column.is_nullable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        column.is_identity
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {column.is_identity ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.comment || <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Definition */}
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-4">SQL Definition</h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            <code>{generateSQL()}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
