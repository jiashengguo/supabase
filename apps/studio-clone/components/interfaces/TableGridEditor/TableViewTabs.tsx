import React from 'react'

interface TableViewTabsProps {
  activeView: 'data' | 'definition'
  onViewChange: (view: 'data' | 'definition') => void
  tableName: string
}

export const TableViewTabs = ({ activeView, onViewChange, tableName }: TableViewTabsProps) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        <button
          onClick={() => onViewChange('data')}
          className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
            activeView === 'data'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Data
        </button>
        <button
          onClick={() => onViewChange('definition')}
          className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
            activeView === 'definition'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Definition
        </button>
      </nav>
    </div>
  )
}
