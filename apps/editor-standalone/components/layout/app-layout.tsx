import { Header } from './header'
import { EnhancedSidebar } from './enhanced-sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <EnhancedSidebar />
        <main className="flex-1 overflow-auto bg-white p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
