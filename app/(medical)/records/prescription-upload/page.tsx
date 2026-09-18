'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Pill,
  Sparkles,
  CheckCircle2,
  Scan,
  Bot,
  FileCheck,
  Clock,
  ArrowRight
} from 'lucide-react'
import { UploadDropzone } from '@/components/records/UploadDropzone'
import { PrescriptionExtractedView } from '@/components/records/PrescriptionExtractedView'
import { Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useMedical } from '@/context/MedicalContext'
import { aiService } from '@/services/aiService'
import type { ExtractedPrescription, ExtractedMedicine, MedicalRecord } from '@/types'

type FlowStep = 'upload' | 'processing' | 'review' | 'success'

export default function PrescriptionUploadPage() {
  const router = useRouter()
  const { familyMembers, addRecord } = useMedical()

  const [step, setStep] = useState<FlowStep>('upload')
  const [selectedMemberId, setSelectedMemberId] = useState(familyMembers[0]?.id ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractedPrescription | null>(null)
  const [savedMedicines, setSavedMedicines] = useState<ExtractedMedicine[]>([])

  const memberOptions = familyMembers.map(m => ({ value: m.id, label: m.name }))

  const handleFileAccepted = async (uploadedFile: File) => {
    setFile(uploadedFile)
    setStep('processing')

    try {
      // Simulate real OCR extraction via aiService abstraction
      const result = await aiService.extractPrescription(
        URL.createObjectURL(uploadedFile),
        uploadedFile.type
      )
      setExtractedData(result)
      setStep('review')
    } catch (err) {
      console.error('Extraction failed:', err)
      setStep('upload')
    }
  }

  const handleConfirmMedicines = (confirmedMedicines: ExtractedMedicine[]) => {
    setSavedMedicines(confirmedMedicines)

    // Automatically create a medical record for this prescription in the vault
    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      familyMemberId: selectedMemberId,
      documentType: 'prescription',
      title: `Prescription — ${extractedData?.doctorName ?? 'General Clinic'}`,
      medicalDate: new Date().toISOString().split('T')[0],
      uploadedAt: new Date().toISOString(),
      hospital: extractedData?.hospitalName,
      tags: confirmedMedicines.map(m => m.name),
      notes: `Extracted ${confirmedMedicines.length} medicine(s) via AI OCR.`,
      hasAIExplanation: true,
    }

    addRecord(newRecord)
    setStep('success')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/records"
        className="inline-flex items-center gap-1.5 text-sm text-brown-600 hover:text-terracotta-600 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Medical Vault
      </Link>

      {/* Flow Progress Stepper */}
      <div className="bg-white border border-[#E8DDD0] rounded-2xl p-4 shadow-warm-sm">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="flex flex-col items-center gap-1">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 'upload'
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-[#EEF4EA] text-[#3D6B2A]'
              }`}
            >
              1
            </span>
            <span className="font-semibold text-espresso">Upload</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 'processing'
                  ? 'bg-terracotta-500 text-white animate-pulse'
                  : step === 'review' || step === 'success'
                  ? 'bg-[#EEF4EA] text-[#3D6B2A]'
                  : 'bg-beige-100 text-brown-400'
              }`}
            >
              2
            </span>
            <span className="font-semibold text-espresso">AI Scan</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 'review'
                  ? 'bg-terracotta-500 text-white'
                  : step === 'success'
                  ? 'bg-[#EEF4EA] text-[#3D6B2A]'
                  : 'bg-beige-100 text-brown-400'
              }`}
            >
              3
            </span>
            <span className="font-semibold text-espresso">Review</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 'success'
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-beige-100 text-brown-400'
              }`}
            >
              4
            </span>
            <span className="font-semibold text-espresso">Tracker</span>
          </div>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif text-espresso">
              Upload Prescription
            </h1>
            <p className="text-warm-muted text-sm mt-1">
              Upload an image or scan of your doctor’s prescription. Our AI will automatically extract medicines, dosages, and schedules for your family medicine tracker.
            </p>
          </div>

          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 space-y-6 shadow-warm-sm">
            <Select
              label="Which family member is this prescription for?"
              options={memberOptions}
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
            />

            <div>
              <label className="text-xs font-medium text-brown-700 block mb-2">
                Prescription Image or PDF
              </label>
              <UploadDropzone
                onFileAccepted={handleFileAccepted}
                accept=".jpg,.jpeg,.png,.pdf"
                maxSizeMB={15}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Processing State */}
      {step === 'processing' && (
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-16 text-center space-y-6 shadow-warm-sm">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-[#FFF4EC] text-[#8B4A20] flex items-center justify-center animate-bounce">
              <Scan className="w-10 h-10 text-terracotta-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-terracotta-500 text-white rounded-full p-1 shadow-warm">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-espresso">
              Analyzing Prescription with Medical OCR…
            </h2>
            <p className="text-xs text-brown-600 max-w-sm mx-auto">
              Scanning doctor handwriting, identifying pharmaceutical names, dosages, and intake instructions.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8DDD0] text-xs text-brown-600">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Extracting medicine entities…</span>
          </div>
        </div>
      )}

      {/* Step 3: Extracted Review */}
      {step === 'review' && extractedData && (
        <PrescriptionExtractedView
          prescription={extractedData}
          onConfirm={handleConfirmMedicines}
          onCancel={() => {
            setStep('upload')
            setFile(null)
          }}
        />
      )}

      {/* Step 4: Success confirmation */}
      {step === 'success' && (
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-12 text-center space-y-6 shadow-warm-sm">
          <div className="w-16 h-16 rounded-full bg-[#EEF4EA] text-[#3D6B2A] border border-[#C8DAB8] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-serif text-espresso">
              Medicines Added to Tracker!
            </h2>
            <p className="text-xs text-brown-600 max-w-md mx-auto">
              Successfully processed prescription and saved {savedMedicines.length} medicine(s) into your family medicine tracker and medical vault.
            </p>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
            <span className="text-brown-500 uppercase text-[10px] font-bold">
              Added Medicines:
            </span>
            {savedMedicines.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-[#F5EFE6] last:border-none">
                <span className="font-bold text-espresso">{m.name} ({m.dosage})</span>
                <span className="text-brown-600">{m.frequency} · {m.duration}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link href="/records">
              <Button variant="secondary">
                View in Medical Vault
              </Button>
            </Link>
            <Link href="/records/prescription-upload">
              <Button variant="primary">
                Upload Another Prescription
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
