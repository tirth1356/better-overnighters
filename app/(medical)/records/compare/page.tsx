'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useMedical } from '@/context/MedicalContext'
import { ReportComparisonView } from '@/components/records/ReportComparisonView'

export default function ComparePage() {
  const searchParams = useSearchParams()
  const focusId = searchParams.get('focus')

  const { records } = useMedical()

  // Filter to records that have quantifiable parameters (e.g. blood reports, lab tests) or all records
  const comparableRecords = records.filter(
    r => r.documentType === 'blood_report' || r.documentType === 'lab_report'
  )

  const initialSelected = focusId ? [focusId] : []

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8DDD0]">
        <Link
          href="/records"
          className="inline-flex items-center gap-2 text-sm text-brown-600 hover:text-terracotta-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medical Vault</span>
        </Link>
        <span className="text-xs text-brown-500">
          Cross-Report Comparative Analytics
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-espresso">
          Compare Medical Reports
        </h1>
        <p className="text-warm-muted text-sm mt-1">
          Evaluate historical shifts across lab tests and blood reports to monitor health trajectories over time
        </p>
      </div>

      {/* Comparison Component */}
      <ReportComparisonView
        availableRecords={comparableRecords.length >= 2 ? comparableRecords : records}
        initialSelectedIds={initialSelected}
      />
    </div>
  )
}
