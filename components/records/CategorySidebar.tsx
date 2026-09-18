'use client'

import { useMedical } from '@/context/MedicalContext'
import { DocumentIcon } from '@/components/ui/DocumentIcon'
import { DOCUMENT_CATEGORIES, DOCUMENT_TYPE_LABELS } from '@/lib/constants'
import type { DocumentType } from '@/types'
import { cn } from '@/lib/utils'

export function CategorySidebar() {
  const { records, filters, setFilters } = useMedical()

  const countByType = (type: DocumentType | 'all') => {
    if (type === 'all') return records.length
    return records.filter(r => r.documentType === type).length
  }

  return (
    <nav
      className="bg-white/70 border border-beige-200 rounded-2xl p-3 space-y-0.5"
      aria-label="Document categories"
    >
      <p className="section-label px-2 pb-2">Categories</p>
      {DOCUMENT_CATEGORIES.map(({ type, label }) => {
        const isActive = filters.documentType === type
        const count = countByType(type as DocumentType | 'all')

        return (
          <button
            key={type}
            onClick={() =>
              setFilters(prev => ({
                ...prev,
                documentType: type as DocumentType | 'all',
              }))
            }
            className={cn(
              'w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm transition-all duration-150 text-left',
              isActive
                ? 'bg-terracotta-500 text-white shadow-warm-sm'
                : 'text-brown-700 hover:bg-beige-100 hover:text-brown-900'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {type !== 'all' ? (
              <DocumentIcon
                type={type as DocumentType}
                size="sm"
                className={isActive ? 'opacity-90' : ''}
              />
            ) : (
              <span
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0',
                  isActive ? 'bg-white/20 text-white' : 'bg-beige-100 text-brown-600'
                )}
              >
                All
              </span>
            )}

            <span className="flex-1 font-medium leading-none">{label}</span>

            {count > 0 && (
              <span
                className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center',
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-beige-100 text-brown-500'
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
