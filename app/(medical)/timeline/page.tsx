'use client'

import { useMedical } from '@/context/MedicalContext'
import { MedicalTimelineView } from '@/components/timeline/MedicalTimelineView'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function TimelinePage() {
  const { timeline, familyMembers, doctors } = useMedical()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-espresso">
            Family Medical Timeline
          </h1>
          <p className="text-warm-muted text-sm mt-1">
            Complete chronological record of diagnoses, prescriptions, lab tests, and doctor consultations
          </p>
        </div>

        <Link href="/records/upload">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Medical Event
          </Button>
        </Link>
      </div>

      <MedicalTimelineView
        timeline={timeline}
        familyMembers={familyMembers}
        doctors={doctors}
      />
    </div>
  )
}
