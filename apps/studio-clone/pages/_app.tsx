import 'react-data-grid/lib/styles.css'
import 'styles/globals.css'

import { Hydrate, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import Head from 'next/head'
import { ErrorInfo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useRootQueryClient } from 'data/query-client'
import { AppPropsWithLayout } from 'types'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = useRootQueryClient()

  const getLayout = Component.getLayout ?? ((page) => page)

  const errorBoundaryHandler = (error: Error, info: ErrorInfo) => {
    console.error('Error:', error.stack)
  }

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      )}
      onError={errorBoundaryHandler}
    >
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <title>Table Editor</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          {getLayout(<Component {...pageProps} />)}
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </Hydrate>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default CustomApp
