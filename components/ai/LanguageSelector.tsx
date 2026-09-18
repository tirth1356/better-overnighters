'use client'

import type { Language } from '@/types'
import { LANGUAGE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Languages } from 'lucide-react'

interface LanguageSelectorProps {
  selectedLanguage: Language
  onSelectLanguage: (lang: Language) => void
  disabled?: boolean
}

export function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
  disabled = false,
}: LanguageSelectorProps) {
  const languages: Language[] = ['en', 'hi', 'gu']

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-brown-600 flex items-center gap-1.5 mr-1">
        <Languages className="w-4 h-4 text-terracotta-600" />
        Choose Language / ભાષા પસંદ કરો / भाषा चुनें:
      </span>
      <div className="inline-flex rounded-xl bg-beige-100 p-1 border border-[#E8DDD0]">
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang
          return (
            <button
              key={lang}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLanguage(lang)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
                isSelected
                  ? 'bg-terracotta-500 text-white shadow-warm-sm'
                  : 'text-brown-700 hover:text-espresso hover:bg-beige-200/60',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
              aria-pressed={isSelected}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
