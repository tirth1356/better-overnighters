// @ts-nocheck
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Field, Modal } from '../../components/ui';
import { addDays, fromISODate, toISODate } from '../../lib/schedule';
import { doctorSpecialty, doseTimes, mealRelation, recordKind } from '@/lib/normalize';
import { newId, saveMedicine, useDB } from '../../lib/store';
import type { MealRelation, Medicine } from '../../types';

const MEAL_OPTIONS: { value: MealRelation; label: string }[] = [
  { value: 'before_food', label: 'Before food' },
  { value: 'after_food', label: 'After food' },
  { value: 'with_food', label: 'With food' },
  { value: 'any', label: 'Anytime' },
];

const daysBetween = (start: string, end: string) =>
  Math.round((fromISODate(end).getTime() - fromISODate(start).getTime()) / 86400000) + 1;

function blank(familyMemberId: string): Medicine {
  return {
    id: newId(),
    familyMemberId,
    name: '',
    dosage: '',
    frequency: 1,
    times: ['08:00'],
    startDate: toISODate(new Date()),
    beforeAfterFood: 'after_food',
  };
}

export default function MedicineForm({
  familyMemberId, editing, onClose,
}: { familyMemberId: string; editing?: Medicine; onClose: () => void }) {
  const { doctors, records } = useDB();
  const [med, setMed] = useState<Medicine>(
    editing
      ? { ...editing, times: doseTimes(editing), beforeAfterFood: mealRelation(editing) }
      : blank(familyMemberId),
  );
  const set = <K extends keyof Medicine>(key: K, value: Medicine[K]) =>
    setMed((m) => ({ ...m, [key]: value }));

  const prescriptions = records.filter(
    (r) => recordKind(r) === 'prescription' && r.familyMemberId === familyMemberId,
  );

  const setTimes = (times: string[]) =>
    setMed((m) => ({ ...m, times, frequency: times.length }));

  const setDuration = (days: number) => {
    if (!days || days < 1) return setMed((m) => ({ ...m, duration: undefined, endDate: undefined }));
    setMed((m) => ({ ...m, duration: days, endDate: addDays(m.startDate, days - 1) }));
  };

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('photo', String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = med.endDate ? daysBetween(med.startDate, med.endDate) : undefined;
    saveMedicine({ ...med, name: med.name.trim(), frequency: med.times.length, duration });
    onClose();
  };

  return (
    <Modal
      title={editing ? 'Edit medicine' : 'Add a medicine'}
      subtitle="Only the name, dose and timing are required."
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="form-row">
          <Field label="Medicine name">
            {(id) => (
              <input
                id={id}
                required
                autoFocus
                placeholder="e.g. Metformin"
                value={med.name}
                onChange={(e) => set('name', e.target.value)}
              />
            )}
          </Field>
          <Field label="Dosage" hint="Strength written on the strip or bottle.">
            {(id) => (
              <input
                id={id}
                required
                placeholder="e.g. 500 mg"
                value={med.dosage}
                onChange={(e) => set('dosage', e.target.value)}
              />
            )}
          </Field>
        </div>

        <Field label="Photo of the medicine" hint="Helps everyone at home pick the right strip.">
          {(id) => (
            <input id={id} type="file" accept="image/*" onChange={(e) => onPhoto(e.target.files?.[0])} />
          )}
        </Field>

        <Field label="Times of day" hint="Add one time per dose. Frequency is counted for you.">
          {(id) => (
            <div className="times-editor" id={id}>
              {med.times.map((t, i) => (
                <span key={i} className="times-editor">
                  <input
                    type="time"
                    value={t}
                    aria-label={`Dose ${i + 1} time`}
                    onChange={(e) => setTimes(med.times.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                  {med.times.length > 1 && (
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Remove dose ${i + 1}`}
                      onClick={() => setTimes(med.times.filter((_, j) => j !== i))}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </span>
              ))}
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setTimes([...med.times, '20:00'])}
              >
                <Plus size={15} /> Add time
              </button>
            </div>
          )}
        </Field>

        <div className="form-row">
          <Field label="Start date">
            {(id) => (
              <input
                id={id}
                type="date"
                required
                value={med.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
            )}
          </Field>
          <Field label="End date" hint="Leave empty for an ongoing medicine.">
            {(id) => (
              <input
                id={id}
                type="date"
                min={med.startDate}
                value={med.endDate ?? ''}
                onChange={(e) => set('endDate', e.target.value || undefined)}
              />
            )}
          </Field>
        </div>

        <div className="form-row">
          <Field label="Duration (days)" hint="Fills in the end date for you.">
            {(id) => (
              <input
                id={id}
                type="number"
                min={1}
                value={med.endDate ? daysBetween(med.startDate, med.endDate) : ''}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            )}
          </Field>
          <Field label="Food">
            {(id) => (
              <select
                id={id}
                value={med.beforeAfterFood}
                onChange={(e) => set('beforeAfterFood', e.target.value as MealRelation)}
              >
                {MEAL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <div className="form-row">
          <Field label="Prescribed by">
            {(id) => (
              <select
                id={id}
                value={med.doctorId ?? ''}
                onChange={(e) => set('doctorId', e.target.value || undefined)}
              >
                <option value="">Not linked</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} — {doctorSpecialty(d)}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="From prescription">
            {(id) => (
              <select
                id={id}
                value={med.prescriptionId ?? ''}
                onChange={(e) => set('prescriptionId', e.target.value || undefined)}
              >
                <option value="">Not linked</option>
                {prescriptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field label="Notes">
          {(id) => (
            <textarea
              id={id}
              placeholder="Anything the family should know — e.g. take with a full glass of water."
              value={med.notes ?? ''}
              onChange={(e) => set('notes', e.target.value)}
            />
          )}
        </Field>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">{editing ? 'Save changes' : 'Add medicine'}</button>
        </div>
      </form>
    </Modal>
  );
}

