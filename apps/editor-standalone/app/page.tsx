import { AppLayout } from '@/components/layout/app-layout'
import { Database } from 'lucide-react'

export default function Home() {
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md px-4">
          <Database className="h-12 w-12 md:h-16 md:w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome to Table Editor
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Select a table from the sidebar to view and edit your data
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-4">
            <span className="hidden md:inline">
              Use the search and schema selector to find your tables quickly
            </span>
            <span className="md:hidden">Tap the menu icon to browse tables</span>
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
