'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Bot,
  ExternalLink,
  Scale,
  Calendar,
  Building2,
  Clock,
  Tag,
  FileText,
  User,
  Share2,
  Download,
  AlertTriangle,
  FileCheck
} from 'lucide-react'
import type { MedicalRecord, FamilyMember, Doctor } from '@/types'
import { DocumentIcon } from '@/components/ui/DocumentIcon'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants'

interface RecordDetailViewProps {
  record: MedicalRecord
  member?: FamilyMember
  doctor?: Doctor
}

export function RecordDetailView({ record, member, doctor }: RecordDetailViewProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top bar navigation & action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DDD0]">
        <Link
          href="/records"
          className="inline-flex items-center gap-2 text-sm text-brown-600 hover:text-terracotta-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medical Vault</span>
        </Link>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            title="Copy link to record"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link' : 'Share'}</span>
          </Button>

          <Link href={`/records/compare?type=${record.documentType}&focus=${record.id}`}>
            <Button variant="secondary" size="sm">
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Reports</span>
            </Button>
          </Link>

          <Link href={`/records/${record.id}/explain`}>
            <Button variant="primary" size="sm" className="bg-terracotta-600 hover:bg-terracotta-700">
              <Bot className="w-4 h-4" />
              <span>Explain with AI</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Record Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E8DDD0] rounded-2xl p-6 shadow-warm-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <DocumentIcon type={record.documentType} size="lg" />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <Badge variant="terracotta">
                  {DOCUMENT_TYPE_LABELS[record.documentType]}
                </Badge>
                {record.hasAIExplanation && (
                  <Badge variant="sage">
                    <Bot className="w-3 h-3" />
                    AI Explanation Ready
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-espresso mt-1.5 leading-tight">
                {record.title}
              </h1>
              <p className="text-xs text-brown-500 mt-1">
                Archived in Parivar Health Record System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={record.fileUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] text-brown-800 text-xs font-semibold hover:bg-beige-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Document</span>
            </a>
            <a
              href={record.fileUrl ?? '#'}
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-beige-100 text-brown-800 text-xs font-semibold hover:bg-beige-200 border border-[#E8DDD0] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 2-column Grid: Document Preview & Clinical Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Previewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden shadow-warm-sm">
            <div className="bg-[#FAF7F2] border-b border-[#E8DDD0] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brown-500" />
                <span className="text-xs font-bold text-brown-700 tracking-wide uppercase">
                  Document Preview
                </span>
              </div>
              <span className="text-[11px] text-brown-500">
                Format: {record.documentType.toUpperCase()}
              </span>
            </div>

            {/* Document Canvas / Simulation */}
            <div className="p-6 md:p-8 bg-[#FAF7F2]/40 min-h-[440px] flex flex-col justify-between">
              {/* Report Header simulation */}
              <div className="border-b border-[#E8DDD0] pb-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-espresso">
                      {record.hospital ?? 'Metropolitan Diagnostic & Pathology Services'}
                    </h3>
                    <p className="text-xs text-brown-500">
                      Accreditation NABL / ISO 15189 Certified
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-espresso">ID: {record.id.toUpperCase()}</p>
                    <p className="text-xs text-brown-500">Date: {formatDate(record.medicalDate)}</p>
                  </div>
                </div>
              </div>

              {/* Patient header simulation */}
              <div className="bg-white border border-[#E8DDD0] rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-brown-500 block text-[10px] uppercase">Patient</span>
                  <span className="font-bold text-espresso">{member?.name ?? 'Registered Patient'}</span>
                </div>
                <div>
                  <span className="text-brown-500 block text-[10px] uppercase">Gender / Blood</span>
                  <span className="font-semibold text-espresso">
                    {member?.gender ? member.gender.toUpperCase() : 'M'} / {member?.bloodGroup ?? 'B+'}
                  </span>
                </div>
                <div>
                  <span className="text-brown-500 block text-[10px] uppercase">Ref. Doctor</span>
                  <span className="font-semibold text-espresso">{doctor?.name ?? 'Dr. V. Shah'}</span>
                </div>
                <div>
                  <span className="text-brown-500 block text-[10px] uppercase">Date of Service</span>
                  <span className="font-semibold text-espresso">{formatDate(record.medicalDate)}</span>
                </div>
              </div>

              {/* Body summary */}
              <div className="bg-white/80 border border-[#E8DDD0] rounded-xl p-6 text-sm text-brown-800 space-y-3 flex-1 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DDD0] flex items-center justify-center text-terracotta-600 mb-1">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-espresso text-base">
                  {record.title}
                </h4>
                <p className="text-xs text-brown-600 max-w-md">
                  Original clinical document archived securely. Use the AI Explanation tool for simplified terminology, bilingual translations (Hindi & Gujarati), and reference range insights.
                </p>
                <div className="pt-2">
                  <Link href={`/records/${record.id}/explain`}>
                    <Button variant="primary" size="sm">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Run AI Clinical Breakdown</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Footer notice */}
              <div className="pt-6 border-t border-[#E8DDD0] mt-6 flex items-center justify-between text-[11px] text-brown-500">
                <span>Verified Digital Medical Record</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structured Clinical Metadata */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Card */}
          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-warm-sm space-y-4">
            <h3 className="section-label text-brown-600">Family Member (Patient)</h3>
            {member ? (
              <div className="flex items-center gap-3.5">
                <Avatar name={member.name} size="lg" />
                <div>
                  <h4 className="font-semibold text-espresso text-base">{member.name}</h4>
                  <p className="text-xs text-brown-500 capitalize">
                    {member.relationship} · {member.gender} · {member.bloodGroup ?? 'Blood group unrecorded'}
                  </p>
                  {member.chronicConditions && member.chronicConditions.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {member.chronicConditions.map(c => (
                        <span key={c} className="text-[10px] bg-beige-100 text-brown-700 px-2 py-0.5 rounded-md border border-[#E8DDD0]">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-brown-500 text-xs">
                <User className="w-4 h-4" />
                <span>No family member tagged</span>
              </div>
            )}
          </div>

          {/* Clinical Dates & Timeline Card */}
          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-warm-sm space-y-4">
            <h3 className="section-label text-brown-600">Date & Location Details</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#F5EFE6]">
                <span className="text-brown-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                  Medical / Test Date
                </span>
                <span className="font-bold text-espresso">{formatDate(record.medicalDate)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#F5EFE6]">
                <span className="text-brown-500 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brown-400" />
                  Uploaded to Vault
                </span>
                <span className="font-medium text-brown-700">{formatDate(record.uploadedAt)}</span>
              </div>

              {record.hospital && (
                <div className="flex items-center justify-between py-1 border-b border-[#F5EFE6]">
                  <span className="text-brown-500 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-brown-400" />
                    Facility / Hospital
                  </span>
                  <span className="font-semibold text-espresso text-right">{record.hospital}</span>
                </div>
              )}
            </div>
          </div>

          {/* Attending Doctor */}
          {doctor && (
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-warm-sm space-y-3">
              <h3 className="section-label text-brown-600">Prescribing / Reviewing Doctor</h3>
              <div>
                <h4 className="font-bold text-espresso text-sm">{doctor.name}</h4>
                <p className="text-xs text-terracotta-700 font-medium">{doctor.specialization}</p>
                <p className="text-xs text-brown-500 mt-0.5">{doctor.hospital}</p>
                {doctor.phone && (
                  <p className="text-xs text-brown-600 mt-2 font-mono">{doctor.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Notes & Tags */}
          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-warm-sm space-y-3">
            <h3 className="section-label text-brown-600">Clinical Notes & Tags</h3>
            {record.notes ? (
              <p className="text-xs text-brown-800 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DDD0]">
                {record.notes}
              </p>
            ) : (
              <p className="text-xs text-brown-400 italic">No notes added for this record.</p>
            )}

            {record.tags && record.tags.length > 0 && (
              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3 h-3 text-brown-400 mr-1" />
                {record.tags.map(tag => (
                  <span key={tag} className="text-xs bg-beige-100 text-brown-700 px-2.5 py-0.5 rounded-full border border-[#E8DDD0]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
