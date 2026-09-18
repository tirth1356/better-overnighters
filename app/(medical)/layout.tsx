'use client'

import { MedicalProvider } from '@/context/MedicalContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export default function MedicalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MedicalProvider>
      <div className="flex min-h-screen bg-page">
        {/* Persistent Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </MedicalProvider>
  )
}
