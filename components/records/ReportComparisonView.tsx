'use client'

import { useState, useEffect } from 'react'
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  Info
} from 'lucide-react'
import type { MedicalRecord, ReportComparison } from '@/types'
import { aiService } from '@/services/aiService'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ReportComparisonViewProps {
  availableRecords: MedicalRecord[]
  initialSelectedIds?: string[]
}

export function ReportComparisonView({
  availableRecords,
  initialSelectedIds = [],
}: ReportComparisonViewProps) {
  // Default to first 2 records of similar type if available, else initialSelectedIds
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialSelectedIds.length >= 2) return initialSelectedIds
    const bloodReports = availableRecords.filter(r => r.documentType === 'blood_report')
    if (bloodReports.length >= 2) return [bloodReports[0].id, bloodReports[1].id]
    return availableRecords.slice(0, 2).map(r => r.id)
  })

  const [comparison, setComparison] = useState<ReportComparison | null>(null)
  const [loading, setLoading] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Fetch comparison whenever selected reports change
  useEffect(() => {
    if (selectedIds.length < 2) {
      setComparison(null)
      return
    }

    const recordsToCompare = availableRecords.filter(r => selectedIds.includes(r.id))
    setLoading(true)

    aiService
      .compareReports(recordsToCompare)
      .then(res => {
        setComparison(res)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [selectedIds, availableRecords])

  const selectedRecords = availableRecords.filter(r => selectedIds.includes(r.id))

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Report Selector Header */}
      <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-warm-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-espresso">
              Select Reports to Compare
            </h3>
            <p className="text-xs text-brown-600 mt-0.5">
              Select two or more reports to view parameter variance and longitudinal trends
            </p>
          </div>
          <span className="text-xs font-semibold text-terracotta-700 bg-[#FAEAE3] px-3 py-1 rounded-full border border-[#F0CCBA]">
            {selectedIds.length} Selected (2 required)
          </span>
        </div>

        {/* Record selection pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {availableRecords.map(record => {
            const isSelected = selectedIds.includes(record.id)
            return (
              <button
                key={record.id}
                type="button"
                onClick={() => toggleSelect(record.id)}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2',
                  isSelected
                    ? 'border-terracotta-500 bg-[#FFF4EC] shadow-warm-sm'
                    : 'border-[#E8DDD0] bg-[#FAF7F2]/50 hover:bg-beige-100/70'
                )}
              >
                <div className="min-w-0">
                  <p className="font-bold text-xs text-espresso truncate">
                    {record.title}
                  </p>
                  <p className="text-[11px] text-brown-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(record.medicalDate)}
                  </p>
                </div>

                <span
                  className={cn(
                    'w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold border flex-shrink-0',
                    isSelected
                      ? 'bg-terracotta-500 text-white border-terracotta-600'
                      : 'border-[#DCCFBE] bg-white'
                  )}
                >
                  {isSelected && '✓'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Comparison Loading */}
      {loading && (
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-16 text-center space-y-4 shadow-warm-sm">
          <div className="w-12 h-12 rounded-full bg-[#FAEAE3] text-terracotta-600 flex items-center justify-center mx-auto animate-pulse">
            <Scale className="w-6 h-6 animate-spin" />
          </div>
          <h4 className="font-serif text-lg font-bold text-espresso">
            Cross-Referencing Report Parameters…
          </h4>
          <p className="text-xs text-brown-500 max-w-sm mx-auto">
            Aligning biomarkers across dates and calculating numerical shifts.
          </p>
        </div>
      )}

      {/* Structured Comparison Matrix */}
      {!loading && comparison && (
        <div className="space-y-6">
          {/* Comparison Table */}
          <div className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden shadow-warm-sm">
            <div className="bg-[#FAF7F2] border-b border-[#E8DDD0] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-serif text-lg font-bold text-espresso">
                  Parameter Variance Matrix
                </h3>
              </div>
              <Badge variant="sage">
                <Sparkles className="w-3 h-3 mr-1" />
                Longitudinal Analysis
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DDD0] text-brown-600 uppercase text-[11px] tracking-wider bg-[#FAF7F2]/40">
                    <th className="py-3 px-4">Biomarker / Parameter</th>
                    <th className="py-3 px-4">Standard Range</th>
                    {selectedRecords.map(r => (
                      <th key={r.id} className="py-3 px-4 font-bold text-espresso">
                        {formatDate(r.medicalDate, 'MMM yyyy')}
                        <span className="block text-[10px] font-normal text-brown-500 truncate max-w-[140px]">
                          {r.title}
                        </span>
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6]">
                  {comparison.parameters.map(param => (
                    <tr key={param.parameter} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-espresso">
                        {param.parameter}
                      </td>
                      <td className="py-3.5 px-4 text-brown-500 font-mono">
                        {param.referenceRange} {param.unit}
                      </td>
                      {selectedRecords.map(r => {
                        const val = param.values[r.id] ?? '—'
                        return (
                          <td key={r.id} className="py-3.5 px-4 font-mono font-bold text-brown-900">
                            {val} <span className="font-normal text-[11px] text-brown-500">{param.unit}</span>
                          </td>
                        )
                      })}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px]',
                            param.trend === 'improving' && 'bg-[#EEF4EA] text-[#3D6B2A] border border-[#C8DAB8]',
                            param.trend === 'stable' && 'bg-beige-100 text-brown-700 border border-[#E8DDD0]',
                            param.trend === 'worsening' && 'bg-[#FAEAEA] text-[#8B2020] border border-[#F5BFBF]'
                          )}
                        >
                          {param.trend === 'improving' && <TrendingUp className="w-3 h-3 text-[#3D6B2A]" />}
                          {param.trend === 'stable' && <Minus className="w-3 h-3 text-brown-500" />}
                          {param.trend === 'worsening' && <TrendingDown className="w-3 h-3 text-[#8B2020]" />}
                          <span className="capitalize">{param.trend}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Trend Explanation Section */}
          <section className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-warm-sm space-y-4">
            <div className="flex items-center gap-2 text-espresso">
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              <h3 className="font-serif text-lg font-bold">
                Clinical Trend Analysis
              </h3>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl p-5 text-sm text-brown-800 leading-relaxed space-y-3">
              <p>{comparison.summary}</p>
            </div>

            {/* Objective Boundary Notice */}
            <div className="flex items-start gap-2.5 text-xs text-brown-600 bg-beige-100/50 p-4 rounded-xl border border-[#E8DDD0]">
              <Info className="w-4 h-4 text-brown-500 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Medical Accuracy Notice: </strong>
                This comparison describes numerical changes between documented lab readings. It does not invent or assert clinical conclusions. Always consult your attending physician to evaluate physiological significance.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Empty selection state */}
      {!loading && selectedIds.length < 2 && (
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-16 text-center space-y-3 shadow-warm-sm">
          <Scale className="w-10 h-10 text-brown-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-espresso">
            Select at least 2 reports
          </h3>
          <p className="text-xs text-brown-600 max-w-sm mx-auto">
            Choose two or more records from the list above to generate a parameter comparison matrix.
          </p>
        </div>
      )}
    </div>
  )
}
