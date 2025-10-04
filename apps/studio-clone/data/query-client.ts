import { QueryClient, onlineManager } from '@tanstack/react-query'
import { useState } from 'react'

// For local development, we can pretend we're online all the time
onlineManager.setOnline(true)

let queryClient: QueryClient | undefined

export function getQueryClient() {
  const _queryClient =
    queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry(failureCount, error) {
            // Don't retry on 4xx errors
            if (error && typeof error === 'object' && 'status' in error) {
              const status = (error as any).status
              if (status >= 400 && status < 500 && status !== 429) {
                return false
              }
            }

            if (failureCount < 3) {
              return true
            }

            return false
          },
          retryDelay(failureCount) {
            // react-query default: doubles, starting at 1000ms, with each attempt, but will not exceed 30 seconds
            return Math.min(1000 * 2 ** failureCount, 30000)
          },
        },
      },
    })

  // For SSG and SSR always create a new queryClient
  if (typeof window === 'undefined') return _queryClient
  // Create the queryClient once in the client
  if (!queryClient) queryClient = _queryClient

  return queryClient
}

export function useRootQueryClient() {
  const [_queryClient] = useState(() => getQueryClient())

  return _queryClient
}
