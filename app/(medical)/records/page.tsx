'use client'

import { Plus, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { useMedical } from '@/context/MedicalContext'
import { RecordCard } from '@/components/records/RecordCard'
import { RecordFilters } from '@/components/records/RecordFilters'
import { CategorySidebar } from '@/components/records/CategorySidebar'
import { Button } from '@/components/ui/Button'

export default function RecordsPage() {
  const { filteredRecords, getFamilyMemberById, getDoctorById } = useMedical()

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-espresso">Medical Vault</h1>
          <p className="text-warm-muted text-sm mt-1">
            {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} in your family health archive
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link href="/records/prescription-upload">
            <Button variant="secondary" size="md">
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Prescription
            </Button>
          </Link>
          <Link href="/records/upload">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4" aria-hidden="true" />
              Upload Record
            </Button>
          </Link>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden lg:block">
          <CategorySidebar />
        </aside>

        {/* Right Content */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* Filters */}
          <RecordFilters />

          {/* Record Grid */}
          {filteredRecords.length > 0 ? (
            <div
              className="grid grid-cols-1 xl:grid-cols-2 gap-3"
              role="list"
              aria-label="Medical records"
            >
              {filteredRecords.map(record => (
                <div key={record.id} role="listitem">
                  <RecordCard
                    record={record}
                    member={getFamilyMemberById(record.familyMemberId)}
                    doctor={record.doctorId ? getDoctorById(record.doctorId) : undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-beige-100 flex items-center justify-center mb-4">
        <FolderOpen className="w-8 h-8 text-brown-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-espresso mb-1">No records found</h3>
      <p className="text-warm-muted text-sm max-w-sm mb-6">
        No medical records match your current filters. Try adjusting the search or upload a new record.
      </p>
      <Link href="/records/upload">
        <Button variant="primary">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Upload First Record
        </Button>
      </Link>
    </div>
  )
}
