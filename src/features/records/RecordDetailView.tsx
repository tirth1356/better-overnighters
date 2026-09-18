import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  ExternalLink,
  Calendar,
  Building2,
  Tag,
  FileText,
  User,
  Share2,
  Download,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import type { MedicalRecord, FamilyMember, Doctor } from '@/types';
import { DocumentIcon } from '@/components/ui/DocumentIcon';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants';
import ReportExplainer from '@/features/ai/ReportExplainer';

interface RecordDetailViewProps {
  record: MedicalRecord;
  member?: FamilyMember;
  doctor?: Doctor;
}

export function RecordDetailView({ record, member, doctor }: RecordDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const [showAiExplainer, setShowAiExplainer] = useState(false);

  const docType = (record as any).documentType || record.type || 'other';
  const recDate = (record as any).medicalDate || record.date;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleReportText = record.summary
    ? `${record.title}\nPatient: ${member?.name ?? 'Patient'}\nDate: ${recDate}\nDoctor: ${doctor?.name ?? record.doctorName ?? 'Physician'}\n\nClinical Findings:\n${record.summary}\n\nNotes:\n${record.notes ?? 'Standard clinical monitoring recommended.'}`
    : `Medical Report: ${record.title}\nDate: ${recDate}\nPatient: ${member?.name ?? 'Patient'}\nFacility: ${record.hospital ?? 'Hospital'}\n\nKey Observations:\nAll physiological parameters analyzed. No acute adverse signs. Routine follow-up scheduled.`;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top bar navigation & action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DDD0]">
        <Link
          to="/medical-records"
          className="inline-flex items-center gap-2 text-sm text-brown-600 hover:text-terracotta-600 font-medium transition-colors"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medical Vault</span>
        </Link>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleShare}
            className="btn btn-outline btn-sm"
            title="Copy link to record"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            <span>{copied ? 'Copied Link' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAiExplainer(prev => !prev)}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Bot className="w-4 h-4" />
            <span>{showAiExplainer ? 'Hide AI Explainer' : 'Explain with Multilingual AI'}</span>
          </button>
        </div>
      </div>

      {/* Record Header Banner */}
      <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <DocumentIcon type={docType} size="lg" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="terra">
                  {DOCUMENT_TYPE_LABELS[docType] ?? docType}
                </Badge>
                <Badge variant="sage">
                  <Bot className="w-3 h-3 mr-1" />
                  AI Explanations: EN · HI · GU
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-espresso mt-1.5 leading-tight">
                {record.title}
              </h1>
              <p className="text-xs text-brown-500 mt-1">
                Archived in FamilyCare Vault · {member?.name ?? 'Family Member'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert(`Opening sample file preview for ${record.title}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] text-brown-800 text-xs font-semibold hover:bg-beige-200 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => alert(`Downloading record file for ${record.title}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-beige-100 text-brown-800 text-xs font-semibold hover:bg-beige-200 border border-[#E8DDD0] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multilingual AI Explainer Section (collapsible / toggleable) */}
      {showAiExplainer && (
        <div className="animate-fade-up">
          <ReportExplainer initialText={sampleReportText} />
        </div>
      )}

      {/* Main 2-column Grid: Document Preview & Clinical Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Previewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-[#FAF7F2] border-b border-[#E8DDD0] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brown-500" />
                <span className="text-xs font-bold text-brown-700 tracking-wide uppercase">
                  Clinical Document View
                </span>
              </div>
              <span className="text-[11px] text-brown-500 font-medium">
                Type: {DOCUMENT_TYPE_LABELS[docType] ?? docType}
              </span>
            </div>

            {/* Document Canvas / Simulation */}
            <div className="p-6 md:p-8 bg-[#FAF7F2]/40 min-h-[380px] flex flex-col justify-between">
              {/* Report Header simulation */}
              <div className="border-b border-[#E8DDD0] pb-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-espresso">
                      {record.hospital ?? 'Sterling Diagnostic & Clinical Services'}
                    </h3>
                    <p className="text-xs text-brown-500">
                      Accredited Diagnostic Centre · Ahmedabad
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-espresso">ID: {record.id.toUpperCase()}</p>
                    <p className="text-xs text-brown-500">Date: {formatDate(recDate)}</p>
                  </div>
                </div>
              </div>

              {/* Patient header simulation */}
              <div className="bg-white border border-[#E8DDD0] rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-brown-500 block text-[10px] uppercase">Patient</span>
                  <span className="font-bold text-espresso">{member?.name ?? 'Patient'}</span>
                </div>
                <div>
                  <span className="text-brown-500 block text-[10px] uppercase">Gender / Blood</span>
                  <span className="font-semibold text-espresso">
                    {member?.gender ? member.gender : '—'} / {member?.bloodGroup ?? '—'}
                  </span>
                </div>
                <div>
                  <span className="text-brown-500 block text-[10px] uppercase">Doctor</span>
                  <span className="font-semibold text-espresso">{doctor?.name ?? record.doctorName ?? 'Consultant'}</span>
                </div>
                <div>
                  <span className="text-brown-500 block text-[10px] uppercase">Test Date</span>
                  <span className="font-semibold text-espresso">{formatDate(recDate)}</span>
                </div>
              </div>

              {/* Body summary */}
              <div className="bg-white border border-[#E8DDD0] rounded-xl p-6 text-sm text-brown-800 space-y-3 flex-1 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DDD0] flex items-center justify-center text-terra mb-1">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-espresso text-base">
                  {record.title}
                </h4>
                <p className="text-xs text-brown-600 max-w-md leading-relaxed">
                  {record.summary ?? 'Original clinical report is safely archived. You can run bilingual AI explanations in Hindi, English, and Gujarati to understand findings and lab reference values.'}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAiExplainer(true)}
                    className="btn btn-primary btn-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    <span>Run AI Medical Explanation</span>
                  </button>
                </div>
              </div>

              {/* Footer notice */}
              <div className="pt-6 border-t border-[#E8DDD0] mt-6 flex items-center justify-between text-[11px] text-brown-500">
                <span>FamilyCare Health Vault Verified</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structured Clinical Metadata */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Card */}
          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-brown-600 uppercase tracking-wider">Family Member (Patient)</h3>
            {member ? (
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: member.avatarColor ?? '#B86F52', color: '#fff' }}>
                  {member.avatarInitials ?? member.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-espresso text-base">{member.name}</h4>
                  <p className="text-xs text-brown-500">
                    {member.relationship || member.relation} · {member.gender} · {member.bloodGroup}
                  </p>
                  {member.conditions && member.conditions.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {member.conditions.map(c => (
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
          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-brown-600 uppercase tracking-wider">Date & Facility</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#F5EFE6]">
                <span className="text-brown-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-terra" />
                  Medical / Test Date
                </span>
                <span className="font-bold text-espresso">{formatDate(recDate)}</span>
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
          {(doctor || record.doctorName) && (
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-brown-600 uppercase tracking-wider">Reviewing Doctor</h3>
              <div>
                <h4 className="font-bold text-espresso text-sm">{doctor?.name || record.doctorName}</h4>
                <p className="text-xs text-terra font-medium">{doctor?.specialty || doctor?.specialization || 'Medical Specialist'}</p>
                <p className="text-xs text-brown-500 mt-0.5">{doctor?.hospital || record.hospital}</p>
                {doctor?.phone && (
                  <p className="text-xs text-brown-600 mt-2 font-mono">{doctor.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Notes & Tags */}
          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-brown-600 uppercase tracking-wider">Clinical Notes & Tags</h3>
            {record.notes ? (
              <p className="text-xs text-brown-800 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DDD0]">
                {record.notes}
              </p>
            ) : (
              <p className="text-xs text-brown-400 italic">No additional clinical notes recorded.</p>
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
  );
}

export default RecordDetailView;
