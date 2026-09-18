'use client'

import { useState } from 'react'
import {
  Sparkles,
  Bot,
  AlertTriangle,
  HelpCircle,
  Activity,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Languages
} from 'lucide-react'
import type { AIExplanation, Language } from '@/types'
import { LanguageSelector } from '@/components/ai/LanguageSelector'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface AIExplanationPanelProps {
  explanation: AIExplanation
  currentLanguage: Language
  onLanguageChange: (lang: Language) => void
  isLoading?: boolean
}

export function AIExplanationPanel({
  explanation,
  currentLanguage,
  onLanguageChange,
  isLoading = false,
}: AIExplanationPanelProps) {
  const [copiedQuestion, setCopiedQuestion] = useState<number | null>(null)

  const copyQuestion = (q: string, idx: number) => {
    navigator.clipboard.writeText(q)
    setCopiedQuestion(idx)
    setTimeout(() => setCopiedQuestion(null), 2000)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* AI Header & Disclaimer banner */}
      <div className="bg-gradient-to-r from-[#FAF7F2] via-[#FDF5EF] to-[#FAF7F2] border border-[#F0CCBA] rounded-2xl p-6 shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-warm-sm flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-espresso">
                  AI Clinical Explanation
                </h2>
                <Badge variant="terracotta">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Multilingual AI
                </Badge>
              </div>
              <p className="text-xs text-brown-600 mt-0.5">
                Clear, empathetic explanation designed for Indian families in 3 languages
              </p>
            </div>
          </div>

          <LanguageSelector
            selectedLanguage={currentLanguage}
            onSelectLanguage={onLanguageChange}
            disabled={isLoading}
          />
        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-4 pt-4 border-t border-[#F0CCBA]/60 flex items-start gap-2.5 text-xs text-[#8F4428]">
          <Info className="w-4 h-4 text-terracotta-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Important Medical Notice: </strong>
            This explanation is for understanding your report and is not a medical diagnosis. Always discuss clinical findings with your doctor.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAEAE3] text-terracotta-600 flex items-center justify-center mx-auto animate-pulse">
            <Bot className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-serif text-lg font-bold text-espresso">
            Translating & Analyzing Report…
          </h3>
          <p className="text-xs text-brown-500 max-w-sm mx-auto">
            Structuring parameters, key terms, and preparing questions for your doctor.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Simple Explanation */}
          <section className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-warm-sm space-y-3">
            <div className="flex items-center gap-2.5 text-espresso">
              <BookOpen className="w-4 h-4 text-terracotta-600" />
              <h3 className="font-serif text-lg font-bold">Simple Explanation</h3>
            </div>
            <p className="text-sm text-brown-800 leading-relaxed bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DDD0]">
              {explanation.simpleExplanation}
            </p>
          </section>

          {/* Section 2: Key Medical Terms */}
          {explanation.keyTerms && explanation.keyTerms.length > 0 && (
            <section className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-warm-sm space-y-4">
              <div className="flex items-center gap-2.5 text-espresso">
                <HelpCircle className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-serif text-lg font-bold">Key Medical Terms</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {explanation.keyTerms.map((item) => (
                  <div
                    key={item.term}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DDD0] space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                      <h4 className="font-bold text-espresso text-sm">{item.term}</h4>
                    </div>
                    <p className="text-xs text-brown-700 leading-relaxed pl-4">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Values and Reference Range */}
          {explanation.labValues && explanation.labValues.length > 0 && (
            <section className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-warm-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-espresso">
                  <Activity className="w-4 h-4 text-terracotta-600" />
                  <h3 className="font-serif text-lg font-bold">Values and Reference Range</h3>
                </div>
                <span className="text-xs text-brown-500">Normal range indicators</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DDD0] text-brown-600 uppercase text-[11px] tracking-wider">
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3">Your Result</th>
                      <th className="py-2.5 px-3">Standard Reference</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFE6]">
                    {explanation.labValues.map((v) => {
                      const isHigh = v.status === 'high' || v.status === 'critical'
                      const isLow = v.status === 'low'
                      const isNormal = v.status === 'normal'

                      return (
                        <tr key={v.parameter} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-3 px-3 font-semibold text-espresso">
                            {v.parameter}
                          </td>
                          <td className="py-3 px-3 font-bold text-brown-900 font-mono">
                            {v.value} <span className="text-brown-500 font-normal">{v.unit}</span>
                          </td>
                          <td className="py-3 px-3 text-brown-600 font-mono">
                            {v.referenceRange} {v.unit}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px]',
                                isNormal && 'bg-[#EEF4EA] text-[#3D6B2A] border border-[#C8DAB8]',
                                isHigh && 'bg-[#FAEAEA] text-[#8B2020] border border-[#F5BFBF]',
                                isLow && 'bg-[#FFF3E0] text-[#7A4F10] border border-[#F5D4A0]'
                              )}
                            >
                              {isNormal && <CheckCircle2 className="w-3 h-3" />}
                              {isHigh && <AlertCircle className="w-3 h-3" />}
                              {isLow && <AlertTriangle className="w-3 h-3" />}
                              <span className="capitalize">{v.status}</span>
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Section 4: Questions to Ask Your Doctor */}
          {explanation.questionsForDoctor && explanation.questionsForDoctor.length > 0 && (
            <section className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-warm-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-espresso">
                  <HelpCircle className="w-4 h-4 text-terracotta-600" />
                  <h3 className="font-serif text-lg font-bold">Questions to Ask Your Doctor</h3>
                </div>
                <span className="text-xs text-brown-500">Take these to your next visit</span>
              </div>

              <div className="space-y-2.5">
                {explanation.questionsForDoctor.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DDD0] hover:border-[#DCCFBE] transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-beige-200 text-brown-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-medium text-espresso leading-relaxed">
                        {q}
                      </p>
                    </div>

                    <button
                      onClick={() => copyQuestion(q, idx)}
                      className="p-1.5 rounded-lg text-brown-400 hover:text-terracotta-600 hover:bg-white transition-all flex-shrink-0"
                      title="Copy question"
                      aria-label={`Copy question ${idx + 1}`}
                    >
                      {copiedQuestion === idx ? (
                        <Check className="w-3.5 h-3.5 text-sage-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 5: Important Notice */}
          <section className="bg-[#FAF7F2] border border-[#E8DDD0] rounded-2xl p-5 shadow-warm-sm flex items-start gap-3 text-xs text-brown-700">
            <Info className="w-4 h-4 text-terracotta-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-espresso text-xs mb-1">Important Notice</h4>
              <p className="leading-relaxed">
                {explanation.importantNotice}
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
