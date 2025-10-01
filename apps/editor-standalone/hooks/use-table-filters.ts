'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Filter, parseFiltersFromUrl, filtersToUrlParams } from '@/lib/types/filters'

/**
 * Hook to manage table filters in URL state
 * Filters are stored as ?filter=column:op:value&filter=column:op:value
 */
export function useTableFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current filters from URL
  const filters = parseFiltersFromUrl(searchParams.getAll('filter'))

  // Update filters in URL
  const setFilters = useCallback(
    (newFilters: Filter[]) => {
      const params = new URLSearchParams(searchParams.toString())

      // Remove all existing filter params
      params.delete('filter')

      // Add new filter params
      const filterParams = filtersToUrlParams(newFilters)
      filterParams.forEach((param) => params.append('filter', param))

      // Reset to page 1 when filters change
      params.set('page', '1')

      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  // Add a single filter
  const addFilter = useCallback(
    (filter: Filter) => {
      setFilters([...filters, filter])
    },
    [filters, setFilters]
  )

  // Remove filter by index
  const removeFilter = useCallback(
    (index: number) => {
      const newFilters = filters.filter((_, i) => i !== index)
      setFilters(newFilters)
    },
    [filters, setFilters]
  )

  // Update filter by index
  const updateFilter = useCallback(
    (index: number, updatedFilter: Filter) => {
      const newFilters = filters.map((f, i) => (i === index ? updatedFilter : f))
      setFilters(newFilters)
    },
    [filters, setFilters]
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters([])
  }, [setFilters])

  return {
    filters,
    setFilters,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    hasFilters: filters.length > 0,
  }
}
