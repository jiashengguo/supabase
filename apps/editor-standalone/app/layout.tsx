import type { Metadata } from 'next'
import './globals.css'
import './main.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Table Editor',
  description: 'Database table editor for developers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
