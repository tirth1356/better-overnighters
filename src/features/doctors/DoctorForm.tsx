// @ts-nocheck
import { useState } from 'react';
import { Field, Modal } from '../../components/ui';
import { newId, saveDoctor } from '../../lib/store';
import type { Doctor } from '../../types';

export default function DoctorForm({
  editing, onClose,
}: { editing?: Doctor; onClose: () => void }) {
  const [doc, setDoc] = useState<Doctor>(
    editing ?? { id: newId(), name: '', specialization: '' },
  );
  const set = <K extends keyof Doctor>(k: K, v: Doctor[K]) => setDoc((d) => ({ ...d, [k]: v }));

  return (
    <Modal title={editing ? 'Edit doctor' : 'Add a doctor'} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveDoctor({ ...doc, name: doc.name.trim() });
          onClose();
        }}
      >
        <div className="form-row">
          <Field label="Doctor name">
            {(id) => (
              <input id={id} required autoFocus placeholder="Dr. Anjali Shah"
                value={doc.name} onChange={(e) => set('name', e.target.value)} />
            )}
          </Field>
          <Field label="Specialization">
            {(id) => (
              <input id={id} required placeholder="Endocrinologist"
                value={doc.specialization} onChange={(e) => set('specialization', e.target.value)} />
            )}
          </Field>
        </div>
        <div className="form-row">
          <Field label="Phone">
            {(id) => (
              <input id={id} type="tel" placeholder="+91 98250 11223"
                value={doc.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
            )}
          </Field>
          <Field label="Email">
            {(id) => (
              <input id={id} type="email" value={doc.email ?? ''}
                onChange={(e) => set('email', e.target.value)} />
            )}
          </Field>
        </div>
        <div className="form-row">
          <Field label="Hospital">
            {(id) => (
              <input id={id} value={doc.hospital ?? ''} onChange={(e) => set('hospital', e.target.value)} />
            )}
          </Field>
          <Field label="Clinic">
            {(id) => (
              <input id={id} value={doc.clinic ?? ''} onChange={(e) => set('clinic', e.target.value)} />
            )}
          </Field>
        </div>
        <Field label="Address">
          {(id) => (
            <input id={id} value={doc.address ?? ''} onChange={(e) => set('address', e.target.value)} />
          )}
        </Field>
        <Field label="Notes">
          {(id) => (
            <textarea id={id} value={doc.notes ?? ''} onChange={(e) => set('notes', e.target.value)}
              placeholder="Consultation days, how to reach the clinic, what they treat." />
          )}
        </Field>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">{editing ? 'Save changes' : 'Add doctor'}</button>
        </div>
      </form>
    </Modal>
  );
}

