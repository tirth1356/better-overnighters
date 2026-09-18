'use client'

import { useState } from 'react'
import { TimelineEventCard } from '@/components/timeline/TimelineEventCard'
import { Select } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Calendar, Filter, Clock } from 'lucide-react'
import type { MedicalTimelineEvent, FamilyMember, Doctor } from '@/types'
import { cn } from '@/lib/utils'

interface MedicalTimelineViewProps {
  timeline: MedicalTimelineEvent[]
  familyMembers: FamilyMember[]
  doctors: Doctor[]
}

export function MedicalTimelineView({
  timeline,
  familyMembers,
  doctors,
}: MedicalTimelineViewProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all')

  const getDoctor = (doctorId?: string) =>
    doctors.find(d => d.id === doctorId)

  const getMember = (memberId: string) =>
    familyMembers.find(m => m.id === memberId)

  // Filter events
  const filteredEvents = timeline
    .filter(e => (selectedMemberId === 'all' ? true : e.familyMemberId === selectedMemberId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-warm-sm">
        <div>
          <h2 className="font-serif text-xl font-bold text-espresso">
            Chronological Health Journey
          </h2>
          <p className="text-xs text-brown-600 mt-0.5">
            Showing {filteredEvents.length} medical milestone{filteredEvents.length !== 1 ? 's' : ''} across family consultations and tests
          </p>
        </div>

        {/* Member filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedMemberId('all')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0',
              selectedMemberId === 'all'
                ? 'bg-terracotta-500 text-white shadow-warm-sm'
                : 'bg-beige-100 text-brown-700 hover:bg-beige-200'
            )}
          >
            All Members
          </button>
          {familyMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0',
                selectedMemberId === m.id
                  ? 'bg-terracotta-500 text-white shadow-warm-sm'
                  : 'bg-beige-100 text-brown-700 hover:bg-beige-200'
              )}
            >
              <Avatar name={m.name} size="xs" />
              <span>{m.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline track */}
      {filteredEvents.length > 0 ? (
        <div className="relative pl-2 sm:pl-4">
          {/* Vertical spine line */}
          <div
            className="absolute left-7 sm:left-9 top-6 bottom-6 w-0.5 bg-[#E8DDD0]"
            aria-hidden="true"
          />

          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <TimelineEventCard
                key={event.id}
                event={event}
                member={getMember(event.familyMemberId)}
                doctor={getDoctor(event.doctorId)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-16 text-center space-y-3 shadow-warm-sm">
          <Clock className="w-10 h-10 text-brown-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-espresso">
            No Events on Timeline
          </h3>
          <p className="text-xs text-brown-600 max-w-sm mx-auto">
            No health milestones recorded for this family member yet.
          </p>
        </div>
      )}
    </div>
  )
}
