'use client'

import Link from 'next/link'
import {
  Calendar,
  Building2,
  Stethoscope,
  ChevronRight,
  FileText,
  Pill,
  Syringe,
  Activity,
  Heart,
  Hospital,
  AlertCircle
} from 'lucide-react'
import type { MedicalTimelineEvent, FamilyMember, Doctor } from '@/types'
import { formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { TIMELINE_EVENT_LABELS } from '@/lib/constants'

const EVENT_ICONS: Record<string, React.ElementType> = {
  record_added: FileText,
  doctor_visit: Stethoscope,
  prescription: Pill,
  vaccination: Syringe,
  lab_result: Activity,
  surgery: Heart,
  hospitalization: Hospital,
}

interface TimelineEventCardProps {
  event: MedicalTimelineEvent
  member?: FamilyMember
  doctor?: Doctor
}

export function TimelineEventCard({
  event,
  member,
  doctor,
}: TimelineEventCardProps) {
  const Icon = EVENT_ICONS[event.eventType] ?? FileText

  return (
    <div className="relative flex items-start gap-4 sm:gap-6 group">
      {/* Node bullet */}
      <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-terracotta-500 shadow-warm-sm group-hover:scale-110 group-hover:bg-terracotta-50 transition-all flex-shrink-0">
        <Icon className="w-4 h-4 text-terracotta-600" />
      </div>

      {/* Event Card Content */}
      <div className="flex-1 bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-warm-sm group-hover:border-[#DCCFBE] group-hover:shadow-warm transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-terracotta-700 bg-[#FAEAE3] border border-[#F0CCBA] px-2.5 py-0.5 rounded-full">
              {formatDate(event.date)}
            </span>
            <span className="text-xs text-brown-500 font-semibold uppercase tracking-wider">
              {TIMELINE_EVENT_LABELS[event.eventType] ?? event.eventType}
            </span>
            {event.isHighlighted && (
              <Badge variant="warning">
                <AlertCircle className="w-3 h-3 mr-1" />
                Key Event
              </Badge>
            )}
          </div>

          {member && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <Avatar name={member.name} size="xs" />
              <span className="text-xs font-semibold text-brown-800">
                {member.name}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="font-serif text-base sm:text-lg font-bold text-espresso mt-2">
          {event.title}
        </h4>

        {/* Summary */}
        {event.summary && (
          <p className="text-xs sm:text-sm text-brown-700 mt-1 leading-relaxed">
            {event.summary}
          </p>
        )}

        {/* Doctor & Facility Details */}
        <div className="mt-3 pt-3 border-t border-[#F5EFE6] flex items-center justify-between gap-4 flex-wrap text-xs text-brown-600">
          <div className="flex items-center gap-4 flex-wrap">
            {doctor && (
              <span className="flex items-center gap-1.5 font-medium text-espresso">
                <Stethoscope className="w-3.5 h-3.5 text-brown-500" />
                {doctor.name}
              </span>
            )}
            {event.hospital && (
              <span className="flex items-center gap-1.5 text-brown-500">
                <Building2 className="w-3.5 h-3.5" />
                {event.hospital}
              </span>
            )}
          </div>

          {event.recordId && (
            <Link
              href={`/records/${event.recordId}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors ml-auto"
            >
              <span>View Record</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
