export function Header() {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Table Editor</h1>
        </div>
        <div className="text-sm text-gray-500">Developer Mode</div>
      </div>
    </header>
  )
}
