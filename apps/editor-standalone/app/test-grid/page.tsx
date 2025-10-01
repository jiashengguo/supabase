import DataGrid from 'react-data-grid'
import 'react-data-grid/lib/styles.css'

export default function TestPage() {
  const columns = [
    { key: 'id', name: 'ID' },
    { key: 'name', name: 'Name' },
  ]

  const rows = [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Grid Test</h1>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <DataGrid columns={columns} rows={rows} style={{ height: '400px' }} />
      </div>
    </div>
  )
}
