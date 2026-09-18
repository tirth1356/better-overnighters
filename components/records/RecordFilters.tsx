'use client'

import { useMedical } from '@/context/MedicalContext'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { X, SlidersHorizontal } from 'lucide-react'
import type { DocumentType } from '@/types'
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants'

const DOC_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  ...Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => ({
    value: k,
    label: v,
  })),
]

export function RecordFilters() {
  const { filters, setFilters, familyMembers, doctors } = useMedical()

  const memberOptions = [
    { value: 'all', label: 'All Members' },
    ...familyMembers.map(m => ({ value: m.id, label: m.name })),
  ]

  const doctorOptions = [
    { value: 'all', label: 'All Doctors' },
    ...doctors.map(d => ({ value: d.id, label: d.name })),
  ]

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.familyMemberId !== 'all' ||
    filters.documentType !== 'all' ||
    filters.doctorId !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== ''

  const clearFilters = () =>
    setFilters({
      searchQuery: '',
      familyMemberId: 'all',
      documentType: 'all',
      doctorId: 'all',
      dateFrom: '',
      dateTo: '',
    })

  return (
    <section className="bg-white/60 border border-beige-200 rounded-2xl p-4 space-y-3" aria-label="Filter records">
      {/* Row 1: Search */}
      <Input
        isSearch
        placeholder="Search records, tags, hospitals…"
        value={filters.searchQuery}
        onChange={e =>
          setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
        }
        aria-label="Search records"
      />

      {/* Row 2: Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Select
          options={memberOptions}
          value={filters.familyMemberId}
          onChange={e =>
            setFilters(prev => ({ ...prev, familyMemberId: e.target.value }))
          }
          aria-label="Filter by family member"
        />
        <Select
          options={DOC_TYPE_OPTIONS}
          value={filters.documentType}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              documentType: e.target.value as DocumentType | 'all',
            }))
          }
          aria-label="Filter by document type"
        />
        <Select
          options={doctorOptions}
          value={filters.doctorId}
          onChange={e =>
            setFilters(prev => ({ ...prev, doctorId: e.target.value }))
          }
          aria-label="Filter by doctor"
        />
        <div className="flex gap-2">
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={e =>
              setFilters(prev => ({ ...prev, dateFrom: e.target.value }))
            }
            aria-label="From date"
            className="text-xs"
          />
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-warm-muted flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" aria-hidden="true" />
            Filters active
          </span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Clear all
          </Button>
        </div>
      )}
    </section>
  )
}
