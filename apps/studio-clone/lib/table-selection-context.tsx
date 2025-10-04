import { createContext, useContext, useState, ReactNode } from 'react'
import { EntitySummary } from 'data/entity-types/entity-types-infinite-query'

interface TableSelectionContextType {
  selectedTable: EntitySummary | null
  setSelectedTable: (table: EntitySummary | null) => void
  selectedTableId: number | null
  setSelectedTableId: (id: number | null) => void
}

const TableSelectionContext = createContext<TableSelectionContextType | null>(null)

export function TableSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedTable, setSelectedTable] = useState<EntitySummary | null>(null)
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)

  return (
    <TableSelectionContext.Provider
      value={{
        selectedTable,
        setSelectedTable,
        selectedTableId,
        setSelectedTableId,
      }}
    >
      {children}
    </TableSelectionContext.Provider>
  )
}

export function useTableSelection() {
  const context = useContext(TableSelectionContext)
  if (!context) {
    throw new Error('useTableSelection must be used within a TableSelectionProvider')
  }
  return context
}
