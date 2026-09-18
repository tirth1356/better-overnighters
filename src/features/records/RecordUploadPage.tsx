import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { UploadDropzone } from './UploadDropzone';
import { Input, Select } from '@/components/ui/Input';
import { useMedical } from '@/context/MedicalContext';
import type { MedicalRecord } from '@/types';
import { newId } from '@/lib/store';

const DOC_TYPE_OPTIONS = [
  { value: 'Lab Report', label: 'Lab Report / Blood Test' },
  { value: 'Prescription', label: 'Prescription' },
  { value: 'Imaging', label: 'X-Ray / MRI / CT / Ultrasound' },
  { value: 'Consultation', label: 'Doctor Consultation Note' },
  { value: 'Discharge Summary', label: 'Hospital Discharge Summary' },
  { value: 'Vaccination', label: 'Vaccination Record' },
  { value: 'Other', label: 'Other Document' },
];

export default function RecordUploadPage() {
  const navigate = useNavigate();
  const { familyMembers, doctors, addRecord } = useMedical();

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    familyMemberId: familyMembers[0]?.id ?? 'member-001',
    type: 'Lab Report',
    title: '',
    date: new Date().toISOString().split('T')[0],
    doctorId: '',
    hospital: '',
    notes: '',
    tags: '',
  });

  const memberOptions = familyMembers.map(m => ({ value: m.id, label: m.name }));
  const doctorOptions = [
    { value: '', label: 'Select doctor or facility' },
    ...doctors.map(d => ({ value: d.id, label: `${d.name} (${d.specialty || d.specialization || 'Physician'})` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const docId = form.doctorId;
    const matchedDoctor = doctors.find(d => d.id === docId);

    const record: MedicalRecord = {
      id: newId('rec'),
      familyMemberId: form.familyMemberId,
      type: form.type as any,
      title: form.title.trim() || (file ? file.name.replace(/\.[^.]+$/, '') : 'Medical Report'),
      date: form.date,
      doctorId: docId || undefined,
      doctorName: matchedDoctor?.name || undefined,
      hospital: form.hospital.trim() || matchedDoctor?.hospital || undefined,
      notes: form.notes.trim() || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : ['Archive', 'Vault'],
      summary: form.notes.trim() || 'Uploaded to secure digital health vault.',
    };

    // Save to unified store and persist to Neon SQL
    await addRecord(record);
    setIsSubmitting(false);

    // Navigate to the newly uploaded record detail page
    navigate(`/records/${record.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8DDD0]">
        <Link
          to="/medical-records"
          className="inline-flex items-center gap-2 text-sm text-brown-600 hover:text-terracotta-600 font-medium"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medical Vault</span>
        </Link>
        <span className="text-xs text-warm-muted">Step 1 of 1 · Direct Vault Archive</span>
      </div>

      <div>
        <h1 className="text-2xl font-serif text-espresso">Upload Medical Record</h1>
        <p className="text-sm text-warm-muted mt-1">
          Add prescriptions, lab reports, imaging scans, and summaries to your family archive.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone */}
        <div className="card p-6">
          <label className="text-xs font-bold text-brown-700 tracking-wider uppercase block mb-3">
            Select File (PDF, PNG, JPG)
          </label>
          <UploadDropzone
            onFileAccepted={f => {
              setFile(f);
              if (!form.title) {
                setForm(prev => ({
                  ...prev,
                  title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
                }));
              }
            }}
          />
        </div>

        {/* Metadata Inputs */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-bold text-brown-700 tracking-wider uppercase">
            Clinical Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Family Member"
              options={memberOptions}
              value={form.familyMemberId}
              onChange={e => setForm(prev => ({ ...prev, familyMemberId: e.target.value }))}
              required
            />
            <Select
              label="Document Type"
              options={DOC_TYPE_OPTIONS}
              value={form.type}
              onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Record Title"
            placeholder="e.g. Fasting Blood Glucose, Chest X-Ray, Cardiology Discharge"
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Test / Consultation Date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              required
            />
            <Select
              label="Attending Doctor"
              options={doctorOptions}
              value={form.doctorId}
              onChange={e => setForm(prev => ({ ...prev, doctorId: e.target.value }))}
            />
          </div>

          <Input
            label="Hospital / Diagnostic Clinic"
            placeholder="e.g. Apollo Hospital, Sterling Heart Institute"
            value={form.hospital}
            onChange={e => setForm(prev => ({ ...prev, hospital: e.target.value }))}
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brown-700">Clinical Findings / Notes</label>
            <textarea
              rows={3}
              className="w-full bg-white border border-[#E8DDD0] rounded-xl text-sm p-3 text-espresso placeholder:text-brown-400 focus:outline-none focus:border-terracotta-400"
              placeholder="Key lab values, physician recommendations, follow-up instructions…"
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            placeholder="e.g. Diabetes, Cardiology, Routine, Annual"
            value={form.tags}
            onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/medical-records" className="btn btn-outline btn-md" style={{ textDecoration: 'none' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-md"
            id="save-record-submit-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>{isSubmitting ? 'Saving to Vault…' : 'Save Medical Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
