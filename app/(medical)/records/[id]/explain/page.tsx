'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react'
import { useMedical } from '@/context/MedicalContext'
import { aiService } from '@/services/aiService'
import { AIExplanationPanel } from '@/components/ai/AIExplanationPanel'
import { Button } from '@/components/ui/Button'
import type { AIExplanation, Language } from '@/types'

export default function RecordExplainPage() {
  const params = useParams()
  const router = useRouter()
  const { getRecordById } = useMedical()

  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const record = getRecordById(id as string)

  const [language, setLanguage] = useState<Language>('en')
  const [explanation, setExplanation] = useState<AIExplanation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!record) return

    let isMounted = true
    setLoading(true)
    setError(null)

    aiService
      .explainMedicalRecord(record, language)
      .then((data) => {
        if (isMounted) {
          setExplanation(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to generate AI explanation.')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [record, language])

  if (!record) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#FAEAEA] text-[#8B2020] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif text-espresso">Record Not Found</h2>
        <p className="text-xs text-brown-600">
          Cannot explain record because ID <span className="font-mono">{id}</span> does not exist.
        </p>
        <div className="pt-2">
          <Link href="/records">
            <Button variant="primary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Medical Vault
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8DDD0]">
        <Link
          href={`/records/${record.id}`}
          className="inline-flex items-center gap-2 text-sm text-brown-600 hover:text-terracotta-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {record.title}</span>
        </Link>

        <span className="text-xs text-brown-500">
          AI Clinical Engine v1.0
        </span>
      </div>

      {error ? (
        <div className="p-8 text-center bg-white border border-red-200 rounded-2xl max-w-md mx-auto space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="font-serif font-bold text-espresso">Explanation Unavailable</h3>
          <p className="text-xs text-brown-600">{error}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLanguage(l => l)}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Try Again
          </Button>
        </div>
      ) : explanation ? (
        <AIExplanationPanel
          explanation={explanation}
          currentLanguage={language}
          onLanguageChange={setLanguage}
          isLoading={loading}
        />
      ) : null}
    </div>
  )
}
