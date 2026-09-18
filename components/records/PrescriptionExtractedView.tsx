'use client'

import { useState } from 'react'
import {
  Pill,
  Edit2,
  Check,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import type { ExtractedMedicine, ExtractedPrescription } from '@/types'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

interface PrescriptionExtractedViewProps {
  prescription: ExtractedPrescription
  onConfirm: (medicines: ExtractedMedicine[]) => void
  onCancel: () => void
}

export function PrescriptionExtractedView({
  prescription,
  onConfirm,
  onCancel,
}: PrescriptionExtractedViewProps) {
  const [medicines, setMedicines] = useState<ExtractedMedicine[]>(
    prescription.medicines
  )
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<ExtractedMedicine>({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    confidence: 1,
  })

  const startEdit = (idx: number) => {
    setEditingIndex(idx)
    setEditForm({ ...medicines[idx] })
  }

  const saveEdit = () => {
    if (editingIndex === null) return
    setMedicines(prev =>
      prev.map((m, i) => (i === editingIndex ? editForm : m))
    )
    setEditingIndex(null)
  }

  const removeMedicine = (idx: number) => {
    setMedicines(prev => prev.filter((_, i) => i !== idx))
  }

  const addEmptyMedicine = () => {
    const newMed: ExtractedMedicine = {
      name: 'New Medicine',
      dosage: '500mg',
      frequency: 'Once daily',
      duration: '7 days',
      instructions: 'After meals',
      confidence: 1,
    }
    setMedicines(prev => [...prev, newMed])
    startEdit(medicines.length)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Banner */}
      <div className="bg-[#FAF7F2] border border-[#E8DDD0] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-espresso">
              Medicines Extracted by AI OCR
            </h3>
            <Badge variant="sage">
              <Sparkles className="w-3 h-3 mr-1" />
              {Math.round(prescription.confidence * 100)}% Confidence
            </Badge>
          </div>
          <p className="text-xs text-brown-600 mt-1">
            Please review each medicine dosage and schedule carefully before adding to your Family Medicine Tracker.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={addEmptyMedicine}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Medicine
        </Button>
      </div>

      {/* Prescription Metadata (Doctor & Hospital detected) */}
      {(prescription.doctorName || prescription.hospitalName) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white border border-[#E8DDD0] rounded-xl p-4">
          <div>
            <span className="text-brown-500 uppercase text-[10px]">Detected Doctor</span>
            <p className="font-bold text-espresso">{prescription.doctorName ?? 'General Practitioner'}</p>
          </div>
          <div>
            <span className="text-brown-500 uppercase text-[10px]">Facility</span>
            <p className="font-semibold text-espresso">{prescription.hospitalName ?? 'Local Clinic'}</p>
          </div>
        </div>
      )}

      {/* Medicine List */}
      <div className="space-y-3">
        {medicines.map((med, idx) => {
          const isEditing = editingIndex === idx

          if (isEditing) {
            return (
              <div
                key={idx}
                className="bg-white border-2 border-terracotta-400 rounded-2xl p-5 shadow-warm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-terracotta-600">
                    Editing Medicine #{idx + 1}
                  </span>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="text-xs text-brown-500 hover:text-brown-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Medicine Name"
                    value={editForm.name}
                    onChange={e =>
                      setEditForm(prev => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    label="Dosage (e.g. 500mg, 1 tablet)"
                    value={editForm.dosage}
                    onChange={e =>
                      setEditForm(prev => ({ ...prev, dosage: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Frequency (e.g. Twice daily, Once daily)"
                    value={editForm.frequency}
                    onChange={e =>
                      setEditForm(prev => ({ ...prev, frequency: e.target.value }))
                    }
                  />
                  <Input
                    label="Duration (e.g. 30 days, 5 days)"
                    value={editForm.duration}
                    onChange={e =>
                      setEditForm(prev => ({ ...prev, duration: e.target.value }))
                    }
                  />
                </div>

                <Input
                  label="Instructions (e.g. After meals)"
                  value={editForm.instructions ?? ''}
                  onChange={e =>
                    setEditForm(prev => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button size="sm" variant="primary" onClick={saveEdit}>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Done Editing
                  </Button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={idx}
              className="bg-white border border-[#E8DDD0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-warm-sm hover:border-[#DCCFBE] transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4EC] text-[#8B4A20] border border-[#F5D4BA] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-espresso text-base">{med.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-beige-100 text-brown-700 font-semibold border border-[#E8DDD0]">
                      {med.dosage}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-xs text-brown-600 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brown-400" />
                      {med.frequency}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brown-400" />
                      {med.duration}
                    </span>
                    {med.instructions && (
                      <span className="text-brown-500 italic">
                        &ldquo;{med.instructions}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => startEdit(idx)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8DDD0] text-xs font-semibold text-brown-700 hover:bg-beige-100 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeMedicine(idx)}
                  className="p-1.5 rounded-lg text-brown-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove medicine"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirmation & Save CTA */}
      <div className="pt-4 border-t border-[#E8DDD0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button variant="ghost" size="md" onClick={onCancel}>
          Cancel & Upload Another
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={() => onConfirm(medicines)}
          disabled={medicines.length === 0}
          className="w-full sm:w-auto"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Add {medicines.length} Medicine{medicines.length !== 1 ? 's' : ''} to Tracker
        </Button>
      </div>
    </div>
  )
}
