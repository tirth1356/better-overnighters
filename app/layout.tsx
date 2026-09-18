import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aarogya Parivar — Family Health Archive',
  description:
    'One digital health space for an entire family to manage medical records, prescriptions, and timeline with multilingual AI assistance.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-page text-espresso">
        {children}
      </body>
    </html>
  )
}
