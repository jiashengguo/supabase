import { useEffect, useState, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS } from '@/lib/constants'

interface RecentTable {
  id: number
  name: string
  schema: string
  lastVisited: number
}

const MAX_RECENT_TABLES = 5

export function useRecentTables() {
  const [recentTables, setRecentTables] = useState<RecentTable[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENTLY_VISITED_TABLES)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setRecentTables(parsed)
      } catch (e) {
        console.error('Failed to parse recent tables:', e)
      }
    }
  }, [])

  const addRecentTable = useCallback((table: Omit<RecentTable, 'lastVisited'>) => {
    setRecentTables((prev) => {
      // Remove if already exists
      const filtered = prev.filter((t) => t.id !== table.id)

      // Add to front with current timestamp
      const updated = [{ ...table, lastVisited: Date.now() }, ...filtered].slice(
        0,
        MAX_RECENT_TABLES
      )

      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEYS.RECENTLY_VISITED_TABLES, JSON.stringify(updated))

      return updated
    })
  }, [])

  const clearRecentTables = useCallback(() => {
    setRecentTables([])
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RECENTLY_VISITED_TABLES)
  }, [])

  return {
    recentTables,
    addRecentTable,
    clearRecentTables,
  }
}
