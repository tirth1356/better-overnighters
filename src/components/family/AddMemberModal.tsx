import { useState } from 'react';
import { X, User, AlertCircle } from 'lucide-react';
import type { FamilyMember, Relationship, Gender, BloodGroup } from '@/types';

const RELATIONSHIPS: Relationship[] = [
  'Self','Spouse','Son','Daughter','Father','Mother',
  'Grandfather','Grandmother','Brother','Sister','Uncle','Aunt','Other',
];

const BLOOD_GROUPS: BloodGroup[] = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];
const GENDERS: Gender[] = ['Male','Female','Other','Prefer not to say'];

interface AddMemberModalProps {
  onClose: () => void;
  onSave:  (member: Omit<FamilyMember, 'id'>) => void;
  existing?: FamilyMember;
}

interface FormState {
  name: string;
  relationship: Relationship;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  allergies: string;
  conditions: string;
  emergencyContact: string;
  emergencyContactName: string;
  notes: string;
}

const DEFAULT: FormState = {
  name: '',
  relationship: 'Other',
  dateOfBirth: '',
  gender: 'Male',
  bloodGroup: 'Unknown',
  allergies: '',
  conditions: '',
  emergencyContact: '',
  emergencyContactName: '',
  notes: '',
};

export default function AddMemberModal({ onClose, onSave, existing }: AddMemberModalProps) {
  const [form, setForm] = useState<FormState>(
    existing
      ? {
          name: existing.name,
          relationship: existing.relationship,
          dateOfBirth: existing.dateOfBirth,
          gender: existing.gender,
          bloodGroup: existing.bloodGroup,
          allergies: existing.allergies.join(', '),
          conditions: existing.conditions.join(', '),
          emergencyContact: existing.emergencyContact ?? '',
          emergencyContactName: existing.emergencyContactName ?? '',
          notes: existing.notes ?? '',
        }
      : DEFAULT
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function set(key: keyof FormState, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters.';
    if (!form.dateOfBirth)
      errs.dateOfBirth = 'Date of birth is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const member: Omit<FamilyMember, 'id'> = {
      name: form.name.trim(),
      relationship: form.relationship,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
      conditions: form.conditions.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: form.emergencyContact || undefined,
      emergencyContactName: form.emergencyContactName || undefined,
      notes: form.notes || undefined,
      activeMedicineCount: 0,
      medicalRecordCount: 0,
    };

    onSave(member);
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-icon">
            <User size={20} />
          </div>
          <div>
            <h2 id="modal-title" className="modal-title">
              {existing ? 'Edit family member' : 'Add family member'}
            </h2>
            <p className="modal-subtitle">Fill in the details below</p>
          </div>
          <button
            id="modal-close-btn"
            className="btn btn-ghost btn-sm modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" noValidate>
          {/* Name + Relationship */}
          <div className="modal-row">
            <div className="form-group">
              <label htmlFor="m-name" className="input-label">Full name <span className="required">*</span></label>
              <input
                id="m-name"
                type="text"
                className={`input-field ${errors.name ? 'error' : ''}`}
                placeholder="Meena Patel"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
              {errors.name && <p className="input-error"><AlertCircle size={12} /> {errors.name}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="m-relationship" className="input-label">Relationship</label>
              <select
                id="m-relationship"
                className="input-field"
                value={form.relationship}
                onChange={e => set('relationship', e.target.value)}
              >
                {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* DOB + Gender */}
          <div className="modal-row">
            <div className="form-group">
              <label htmlFor="m-dob" className="input-label">Date of birth <span className="required">*</span></label>
              <input
                id="m-dob"
                type="date"
                className={`input-field ${errors.dateOfBirth ? 'error' : ''}`}
                value={form.dateOfBirth}
                onChange={e => set('dateOfBirth', e.target.value)}
              />
              {errors.dateOfBirth && <p className="input-error"><AlertCircle size={12} /> {errors.dateOfBirth}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="m-gender" className="input-label">Gender</label>
              <select
                id="m-gender"
                className="input-field"
                value={form.gender}
                onChange={e => set('gender', e.target.value)}
              >
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Blood Group */}
          <div className="form-group">
            <label htmlFor="m-blood" className="input-label">Blood group</label>
            <select
              id="m-blood"
              className="input-field"
              value={form.bloodGroup}
              onChange={e => set('bloodGroup', e.target.value)}
              style={{ maxWidth: '180px' }}
            >
              {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Allergies */}
          <div className="form-group">
            <label htmlFor="m-allergies" className="input-label">Allergies</label>
            <input
              id="m-allergies"
              type="text"
              className="input-field"
              placeholder="Penicillin, Dust mites (comma-separated)"
              value={form.allergies}
              onChange={e => set('allergies', e.target.value)}
            />
          </div>

          {/* Conditions */}
          <div className="form-group">
            <label htmlFor="m-conditions" className="input-label">Medical conditions</label>
            <input
              id="m-conditions"
              type="text"
              className="input-field"
              placeholder="Type 2 Diabetes, Hypertension (comma-separated)"
              value={form.conditions}
              onChange={e => set('conditions', e.target.value)}
            />
          </div>

          {/* Emergency contact */}
          <div className="modal-row">
            <div className="form-group">
              <label htmlFor="m-ec-name" className="input-label">Emergency contact name</label>
              <input
                id="m-ec-name"
                type="text"
                className="input-field"
                placeholder="Rajesh Patel"
                value={form.emergencyContactName}
                onChange={e => set('emergencyContactName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="m-ec-phone" className="input-label">Emergency phone</label>
              <input
                id="m-ec-phone"
                type="tel"
                className="input-field"
                placeholder="+91 98765 43210"
                value={form.emergencyContact}
                onChange={e => set('emergencyContact', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="m-notes" className="input-label">Notes</label>
            <textarea
              id="m-notes"
              className="input-field"
              placeholder="Any additional health notes…"
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline btn-md" onClick={onClose}>
              Cancel
            </button>
            <button id="modal-save-btn" type="submit" className="btn btn-primary btn-md">
              {existing ? 'Save changes' : 'Add member'}
            </button>
          </div>
        </form>
      </div>

      <style>{modalStyles}</style>
    </div>
  );
}

const modalStyles = `
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(48, 37, 31, 0.5);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: fadeUp 0.15s ease;
  }
  .modal {
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 100%; max-width: 600px;
    max-height: 90dvh;
    overflow-y: auto;
  }
  .modal-header {
    display: flex; align-items: flex-start; gap: 1rem;
    padding: 1.5rem 1.5rem 1rem;
    position: sticky; top: 0;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    z-index: 1;
  }
  .modal-header-icon {
    width: 40px; height: 40px;
    border-radius: var(--radius-md);
    background: var(--color-cream);
    display: flex; align-items: center; justify-content: center;
    color: var(--color-brown);
    flex-shrink: 0;
  }
  .modal-title { font-size: 1.125rem; color: var(--color-text); font-family: var(--font-sans); }
  .modal-subtitle { font-size: 0.875rem; color: var(--color-text-muted); margin-top: 1px; }
  .modal-close { margin-left: auto; color: var(--color-text-muted); }
  .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.125rem; }
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.5rem; }
  .required { color: var(--color-terra); }
  .input-error { display: flex; align-items: center; gap: 0.25rem; font-size: 0.8125rem; color: #C85A5A; margin-top: 0.2rem; }
  @media (max-width: 480px) {
    .modal-row { grid-template-columns: 1fr; }
  }
`;
