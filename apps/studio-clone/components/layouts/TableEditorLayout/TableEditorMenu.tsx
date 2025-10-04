import { useState } from 'react'
import { useRouter } from 'next/router'
import { useEntityTypesQuery } from 'data/entity-types/entity-types-infinite-query'
import { ENTITY_TYPE } from 'data/entity-types/entity-type-constants'
import { useSelectedProjectQuery } from 'hooks/useSelectedProject'
import { useQuerySchemaState } from 'hooks/useSchemaQueryState'
import { useTableSelection } from 'lib/table-selection-context'

export const TableEditorMenu = () => {
  const router = useRouter()
  const { data: project } = useSelectedProjectQuery()
  const { selectedSchema } = useQuerySchemaState()
  const { selectedTableId, setSelectedTableId, setSelectedTable } = useTableSelection()
  const [searchText, setSearchText] = useState<string>('')
  const [visibleTypes] = useState<string[]>(Object.values(ENTITY_TYPE))

  const { data, isLoading, isError, error } = useEntityTypesQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
    schemas: [selectedSchema],
    search: searchText.trim() || undefined,
    sort: 'alphabetical',
    filterTypes: visibleTypes,
  })

  const entityTypes = data?.pages.flatMap((page) => page.data.entities) || []

  if (isLoading) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Tables</h2>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Tables</h2>
        <div className="text-red-600">Error loading tables</div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Tables</h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search tables..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tables list */}
      <div className="flex-1 overflow-y-auto p-4">
        {entityTypes.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            {searchText ? 'No tables found matching your search.' : 'No tables found.'}
          </div>
        ) : (
          <div className="space-y-1">
            {entityTypes.map((entity) => (
              <div
                key={entity.id}
                onClick={() => {
                  setSelectedTableId(entity.id)
                  setSelectedTable(entity)
                  router.push(`/editor/${entity.id}`)
                }}
                className={`flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer group ${
                  selectedTableId === entity.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                }`}
              >
                <div className="w-4 h-4 mr-3 flex-shrink-0">
                  {entity.type === ENTITY_TYPE.TABLE && (
                    <div className="w-full h-full bg-blue-500 rounded-sm"></div>
                  )}
                  {entity.type === ENTITY_TYPE.VIEW && (
                    <div className="w-full h-full bg-green-500 rounded-sm"></div>
                  )}
                  {entity.type === ENTITY_TYPE.MATERIALIZED_VIEW && (
                    <div className="w-full h-full bg-orange-500 rounded-sm"></div>
                  )}
                  {entity.type === ENTITY_TYPE.FOREIGN_TABLE && (
                    <div className="w-full h-full bg-purple-500 rounded-sm"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{entity.name}</div>
                  {entity.comment && (
                    <div className="text-xs text-gray-500 truncate">{entity.comment}</div>
                  )}
                </div>
                {entity.rls_enabled && (
                  <div className="ml-2 text-xs text-green-600 font-medium">RLS</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
