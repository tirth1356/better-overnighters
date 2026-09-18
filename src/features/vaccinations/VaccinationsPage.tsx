// @ts-nocheck
import { CalendarClock, FileText, Pencil, Plus, Syringe, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card, EmptyState, Field, Modal } from '../../components/ui';
import { useMember } from '../../lib/member';
import { fromISODate, toISODate } from '../../lib/schedule';
import { deleteVaccination, newId, saveVaccination, useDB } from '../../lib/store';
import { vaccineDate, vaccineName } from '@/lib/normalize';
import { vaccinationStatus } from '../../lib/vaccination';
import type { Vaccination, VaccinationStatus } from '../../types';
import MemberSwitcher from '../common/MemberSwitcher';
import './vaccinations.css';

const STATUS_LABEL: Record<VaccinationStatus, string> = {
  completed: 'Completed',
  upcoming: 'Upcoming',
  overdue: 'Overdue',
};

const longDate = (iso: string) =>
  fromISODate(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

function VaccinationForm({
  familyMemberId, editing, onClose,
}: { familyMemberId: string; editing?: Vaccination; onClose: () => void }) {
  const [v, setV] = useState<Vaccination>(
    editing ?? { id: newId(), familyMemberId, vaccine: '', dose: '' },
  );
  const set = <K extends keyof Vaccination>(k: K, val: Vaccination[K]) =>
    setV((cur) => ({ ...cur, [k]: val }));

  return (
    <Modal title={editing ? 'Edit vaccination' : 'Add a vaccination'} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = vaccineName(v).trim();
          saveVaccination({ ...v, vaccine: name, name });
          onClose();
        }}
      >
        <div className="form-row">
          <Field label="Vaccine">
            {(id) => (
              <input id={id} required autoFocus placeholder="e.g. DTP Booster"
                value={vaccineName(v)} onChange={(e) => set('vaccine', e.target.value)} />
            )}
          </Field>
          <Field label="Dose">
            {(id) => (
              <input id={id} required placeholder="e.g. Dose 2 / Booster"
                value={v.dose ?? ''} onChange={(e) => set('dose', e.target.value)} />
            )}
          </Field>
        </div>
        <div className="form-row">
          <Field label="Date given" hint="Leave empty if it is only scheduled.">
            {(id) => (
              <input id={id} type="date" value={vaccineDate(v) ?? ''}
                onChange={(e) => set('date', e.target.value || undefined)} />
            )}
          </Field>
          <Field label="Next due date">
            {(id) => (
              <input id={id} type="date" value={v.nextDueDate ?? ''}
                onChange={(e) => set('nextDueDate', e.target.value || undefined)} />
            )}
          </Field>
        </div>
        <Field label="Document" hint="Link to the certificate or record.">
          {(id) => (
            <input id={id} type="url" placeholder="https://…"
              value={v.document ?? ''} onChange={(e) => set('document', e.target.value || undefined)} />
          )}
        </Field>
        <Field label="Notes">
          {(id) => (
            <textarea id={id} value={v.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
          )}
        </Field>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">{editing ? 'Save changes' : 'Add vaccination'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function VaccinationsPage() {
  const { member } = useMember();
  const { vaccinations } = useDB();
  const today = toISODate(new Date());
  const [form, setForm] = useState<{ open: boolean; editing?: Vaccination }>({ open: false });

  const mine = vaccinations
    .filter((v) => v.familyMemberId === member?.id)
    .map((v) => ({ ...v, status: vaccinationStatus(v, today) }))
    .sort((a, b) =>
      (b.nextDueDate ?? vaccineDate(b) ?? '').localeCompare(a.nextDueDate ?? vaccineDate(a) ?? ''));

  const count = (s: VaccinationStatus) => mine.filter((v) => v.status === s).length;

  return (
    <>
      <MemberSwitcher />
      <header className="page-head">
        <div className="page-head__row">
          <div>
            <h1>Vaccinations</h1>
            <p>{member?.name}’s vaccine history and what is due next.</p>
          </div>
          <button type="button" className="btn" onClick={() => setForm({ open: true })}>
            <Plus size={18} /> Add vaccination
          </button>
        </div>
      </header>

      <div className="vax-summary">
        {(['completed', 'upcoming', 'overdue'] as VaccinationStatus[]).map((s) => (
          <Card key={s} className="card--flat">
            <div className="vax-summary__count">{count(s)}</div>
            <div className="vax-summary__label">{STATUS_LABEL[s]}</div>
          </Card>
        ))}
      </div>

      {mine.length === 0 ? (
        <EmptyState
          icon={<Syringe size={34} />}
          title="No vaccinations recorded"
          hint={`Add ${member?.name}’s vaccines to keep due dates from slipping.`}
          action={
            <button type="button" className="btn" onClick={() => setForm({ open: true })}>
              <Plus size={18} /> Add vaccination
            </button>
          }
        />
      ) : (
        <Card title="Timeline">
          <div className="vax-timeline">
            {mine.map((v) => (
              <div key={v.id} className={`vax-item vax-item--${v.status}`}>
                <div className="vax-item__head">
                  <span className="vax-item__name">{vaccineName(v)}</span>
                  {v.dose && <span className="pill">{v.dose}</span>}
                  <span className={`pill pill--${v.status}`}>{STATUS_LABEL[v.status]}</span>
                </div>
                <div className="vax-item__meta">
                  {vaccineDate(v) ? `Given ${longDate(vaccineDate(v)!)}` : 'Not given yet'}
                  {v.nextDueDate && (
                    <> · <CalendarClock size={13} style={{ verticalAlign: '-2px' }} /> Next due {longDate(v.nextDueDate)}</>
                  )}
                </div>
                {v.notes && <div className="vax-item__meta">{v.notes}</div>}
                <div className="vax-item__actions">
                  {v.document && (
                    <a className="btn btn--ghost btn--sm" href={v.document} target="_blank" rel="noreferrer">
                      <FileText size={15} /> Document
                    </a>
                  )}
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setForm({ open: true, editing: v })}>
                    <Pencil size={15} /> Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => { if (confirm(`Remove ${vaccineName(v)}?`)) deleteVaccination(v.id); }}
                  >
                    <Trash2 size={15} />
                    <span className="visually-hidden">Remove {vaccineName(v)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {form.open && member && (
        <VaccinationForm
          familyMemberId={member.id}
          editing={form.editing}
          onClose={() => setForm({ open: false })}
        />
      )}
    </>
  );
}

