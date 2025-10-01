import { useQuery } from '@tanstack/react-query'
import { getPostgresMetaUrl } from '@/lib/supabase'

interface Schema {
  id: number
  name: string
}

async function fetchSchemas(): Promise<Schema[]> {
  const metaUrl = getPostgresMetaUrl()
  const response = await fetch(`${metaUrl}/schemas`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch schemas: ${response.statusText}`)
  }

  const data: Schema[] = await response.json()
  // Filter out system schemas
  return data.filter(
    (schema) =>
      !['information_schema', 'pg_catalog', 'pg_toast'].some((sys) => schema.name.startsWith(sys))
  )
}

export function useSchemas() {
  return useQuery({
    queryKey: ['schemas'],
    queryFn: fetchSchemas,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
