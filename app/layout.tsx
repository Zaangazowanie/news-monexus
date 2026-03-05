import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Monexus News',
  description: 'Geopolitics-driven world news by Monexus'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
