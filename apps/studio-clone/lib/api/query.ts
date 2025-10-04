import { constructHeaders } from './apiHelpers'

export type QueryOptions = {
  query: string
  headers?: HeadersInit
}

export type PgMetaDatabaseError = {
  message: string
  code: string
  status: number
  formattedError?: string
}

export type WrappedResult<T> = {
  data: T | undefined
  error: Error | PgMetaDatabaseError | undefined
}

/**
 * Executes a SQL query against the local Postgres instance via pg-meta service.
 * Uses a proxy API route to avoid CORS issues.
 */
export async function executeQuery<T = unknown>({
  query,
  headers,
}: QueryOptions): Promise<WrappedResult<T[]>> {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...constructHeaders(headers ?? {}),
    },
    body: JSON.stringify({ query }),
  })

  try {
    const result = await response.json()

    if (!response.ok) {
      const error: PgMetaDatabaseError = {
        message: result.message || 'Database error',
        code: result.code || 'UNKNOWN_ERROR',
        status: response.status,
        formattedError: result.formattedError,
      }
      return { data: undefined, error }
    }

    return { data: result, error: undefined }
  } catch (error) {
    if (error instanceof Error) {
      return { data: undefined, error }
    }
    throw error
  }
}
