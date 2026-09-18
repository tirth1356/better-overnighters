'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { UploadDropzone } from '@/components/records/UploadDropzone'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useMedical } from '@/context/MedicalContext'
import { storageService } from '@/services/storageService'
import type { MedicalRecord, DocumentType } from '@/types'
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants'

const DOC_TYPE_OPTIONS = Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => ({
  value: k,
  label: v,
}))

export default function UploadPage() {
  const router = useRouter()
  const { familyMembers, doctors, addRecord } = useMedical()

  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [form, setForm] = useState({
    familyMemberId: familyMembers[0]?.id ?? '',
    documentType: 'blood_report' as DocumentType,
    title: '',
    medicalDate: new Date().toISOString().split('T')[0],
    doctorId: '',
    hospital: '',
    notes: '',
    tags: '',
  })

  const memberOptions = familyMembers.map(m => ({ value: m.id, label: m.name }))
  const doctorOptions = [
    { value: '', label: 'No doctor / unknown' },
    ...doctors.map(d => ({ value: d.id, label: d.name })),
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    try {
      const uploaded = await storageService.uploadFile(file)

      const record: MedicalRecord = {
        id: `rec-${Date.now()}`,
        familyMemberId: form.familyMemberId,
        documentType: form.documentType,
        title: form.title || file.name.replace(/\.[^.]+$/, ''),
        medicalDate: form.medicalDate,
        uploadedAt: new Date().toISOString(),
        doctorId: form.doctorId || undefined,
        hospital: form.hospital || undefined,
        fileUrl: uploaded.fileUrl,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        notes: form.notes || undefined,
        hasAIExplanation: false,
      }

      addRecord(record)
      router.push(`/records/${record.id}`)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/records"
        className="inline-flex items-center gap-1.5 text-sm text-warm-muted hover:text-terracotta-600 transition-colors mb-6"
        aria-label="Back to Medical Vault"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to Vault
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-serif text-espresso">Upload Medical Record</h1>
        <p className="text-warm-muted text-sm mt-1">
          Add a new document to your family health archive
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-espresso text-base">Document</h2>
          <UploadDropzone onFileAccepted={setFile} />
        </section>

        {/* Metadata */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-espresso text-base">Details</h2>

          <Input
            label="Title"
            placeholder="e.g. CBC Blood Report — September 2026"
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Family Member"
              options={memberOptions}
              value={form.familyMemberId}
              onChange={e => setForm(prev => ({ ...prev, familyMemberId: e.target.value }))}
            />
            <Select
              label="Document Type"
              options={DOC_TYPE_OPTIONS}
              value={form.documentType}
              onChange={e =>
                setForm(prev => ({ ...prev, documentType: e.target.value as DocumentType }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Medical Date"
              type="date"
              value={form.medicalDate}
              onChange={e => setForm(prev => ({ ...prev, medicalDate: e.target.value }))}
            />
            <Select
              label="Doctor"
              options={doctorOptions}
              value={form.doctorId}
              onChange={e => setForm(prev => ({ ...prev, doctorId: e.target.value }))}
            />
          </div>

          <Input
            label="Hospital / Clinic"
            placeholder="e.g. Sunshine Multispeciality Hospital"
            value={form.hospital}
            onChange={e => setForm(prev => ({ ...prev, hospital: e.target.value }))}
          />

          <Input
            label="Tags (comma-separated)"
            placeholder="e.g. CBC, HbA1c, diabetes"
            value={form.tags}
            onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brown-700" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Any additional context for this record…"
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-white border border-beige-200 rounded-xl text-sm text-espresso placeholder:text-brown-400 px-3 py-2.5 transition-all resize-none focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/20"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link href="/records">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!file}
            isLoading={isUploading}
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            {isUploading ? 'Uploading…' : 'Save Record'}
          </Button>
        </div>
      </form>
    </div>
  )
}
