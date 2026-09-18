'use client'

import Link from 'next/link'
import { Calendar, Building2, Bot, ChevronRight, User } from 'lucide-react'
import type { MedicalRecord, FamilyMember, Doctor } from '@/types'
import { DocumentIcon } from '@/components/ui/DocumentIcon'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants'

interface RecordCardProps {
  record: MedicalRecord
  member?: FamilyMember
  doctor?: Doctor
}

export function RecordCard({ record, member, doctor }: RecordCardProps) {
  return (
    <Link
      href={`/records/${record.id}`}
      className="block group"
      aria-label={`Open ${record.title}`}
    >
      <article className="card card-hover p-4 flex gap-4 items-start cursor-pointer transition-all duration-200">
        {/* Document Icon */}
        <DocumentIcon type={record.documentType} size="md" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-espresso text-sm leading-snug truncate group-hover:text-terracotta-600 transition-colors">
                {record.title}
              </h3>
              <p className="text-xs text-warm-muted mt-0.5">
                {DOCUMENT_TYPE_LABELS[record.documentType]}
              </p>
            </div>

            <ChevronRight
              className="w-4 h-4 text-brown-400 flex-shrink-0 mt-0.5 group-hover:text-terracotta-500 transition-colors"
              aria-hidden="true"
            />
          </div>

          {/* Meta row */}
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-warm-muted">
            {/* Date */}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              {formatDate(record.medicalDate)}
            </span>

            {/* Member */}
            {member && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                {member.name.split(' ')[0]}
              </span>
            )}

            {/* Hospital */}
            {record.hospital && (
              <span className="flex items-center gap-1 truncate max-w-[180px]">
                <Building2 className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{record.hospital}</span>
              </span>
            )}
          </div>

          {/* Doctor + AI badge */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {doctor && (
              <span className="text-xs text-brown-600 font-medium">{doctor.name}</span>
            )}
            {record.hasAIExplanation && (
              <Badge variant="sage">
                <Bot className="w-3 h-3" aria-hidden="true" />
                AI Ready
              </Badge>
            )}
            {record.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="warm">{tag}</Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
