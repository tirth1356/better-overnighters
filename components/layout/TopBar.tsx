'use client'

import { useMedical } from '@/context/MedicalContext'
import { Avatar } from '@/components/ui/Avatar'
import { Globe2, ShieldCheck, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { familyMembers, filters, setFilters } = useMedical()

  return (
    <header className="h-16 bg-[#FAF7F2]/95 backdrop-blur border-b border-[#E8DDD0] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Family Members Quick Selector */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <span className="text-xs font-semibold text-brown-600 mr-1 flex items-center gap-1 flex-shrink-0">
          <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500" />
          Member:
        </span>
        <button
          onClick={() => setFilters(prev => ({ ...prev, familyMemberId: 'all' }))}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0',
            filters.familyMemberId === 'all'
              ? 'bg-terracotta-500 text-white shadow-warm-sm'
              : 'bg-white border border-[#E8DDD0] text-brown-700 hover:bg-beige-100'
          )}
        >
          All Family
        </button>

        {familyMembers.map((member) => {
          const isSelected = filters.familyMemberId === member.id
          return (
            <button
              key={member.id}
              onClick={() => setFilters(prev => ({ ...prev, familyMemberId: member.id }))}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0',
                isSelected
                  ? 'bg-terracotta-500 text-white shadow-warm-sm'
                  : 'bg-white border border-[#E8DDD0] text-brown-700 hover:bg-beige-100'
              )}
            >
              <Avatar
                name={member.name}
                size="xs"
                className={isSelected ? 'ring-1 ring-white' : ''}
              />
              <span>{member.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">({member.relationship})</span>
            </button>
          )
        })}
      </div>

      {/* Right controls: Multilingual badge & security notice */}
      <div className="flex items-center gap-3 pl-4 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF4EA] border border-[#C8DAB8] text-[#3D6B2A] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Family Encrypted</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E8DDD0] text-brown-700 text-xs font-medium">
          <Globe2 className="w-3.5 h-3.5 text-terracotta-500" />
          <span>EN · हि · ગુ</span>
        </div>
      </div>
    </header>
  )
}
