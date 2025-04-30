import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'My Event Org',
  description: 'Event Management System',
  generator: 'nk10nikhil',
  keywords: 'event, management, tech, conference',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
