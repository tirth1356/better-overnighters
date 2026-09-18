// @ts-nocheck
import { ScanLine, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Field, Modal } from '../../components/ui';
import { extractPrescription } from '../../lib/ai';
import type { PrescriptionExtraction } from '../../lib/ai';
import { toISODate } from '../../lib/schedule';
import { newId, saveMedicine, useDB } from '../../lib/store';
import type { Medicine } from '../../types';
import AiBanner from './AiBanner';
import './ai.css';

/** Days, parsed from free text like "10 days" / "2 weeks". Unclear -> no end date. */
function durationDays(duration: string): number | undefined {
  const m = duration.match(/(\d+)\s*(day|week|month)/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  return unit === 'week' ? n * 7 : unit === 'month' ? n * 30 : n;
}

/**
 * Prescription text in, draft medicines out. Nothing is saved until the user
 * confirms each row — extracted data is a suggestion, not a source of truth.
 */
export default function PrescriptionImport({
  familyMemberId, prescriptionId, onClose,
}: { familyMemberId: string; prescriptionId?: string; onClose: () => void }) {
  const { doctors, medicines } = useDB();
  const [text, setText] = useState('');
  const [result, setResult] = useState<PrescriptionExtraction | null>(null);
  const [chosen, setChosen] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await extractPrescription(text);
      setResult(data);
      setChosen(new Set(data.medicines.map((_, i) => i)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach the AI service');
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (!result) return;
    // Re-running extraction must not file the same medicine twice.
    const alreadySaved = (name: string, dosage: string) =>
      medicines.some(
        (x) =>
          x.familyMemberId === familyMemberId &&
          x.name.trim().toLowerCase() === name.trim().toLowerCase() &&
          (x.dosage ?? '').trim().toLowerCase() === dosage.trim().toLowerCase(),
      );
    const today = toISODate(new Date());
    const doctorId = doctors.find(
      (d) => result.doctorName && d.name.toLowerCase().includes(result.doctorName.toLowerCase().replace('dr.', '').trim()),
    )?.id;

    result.medicines.forEach((m, i) => {
      if (!chosen.has(i) || alreadySaved(m.medicineName, m.dosage)) return;
      const days = durationDays(m.duration);
      const times = m.times.length > 0 ? m.times : ['08:00'];
      const med: Medicine = {
        id: newId(),
        familyMemberId,
        name: m.medicineName,
        dosage: m.dosage,
        frequency: m.frequency || times.length,
        times,
        startDate: today,
        duration: days,
        beforeAfterFood: m.beforeAfterFood,
        // keep Person 1's fields populated so the dashboard counts this medicine
        timing: m.beforeAfterFood === 'before_food' ? 'Before meal'
          : m.beforeAfterFood === 'with_food' ? 'With meal'
          : m.beforeAfterFood === 'any' ? 'Anytime' : 'After meal',
        isActive: true,
        prescriptionId,
        doctorId,
        notes: `Added from a prescription${m.duration ? ` · ${m.duration}` : ''}. Please check the details.`,
      };
      if (days) {
        const end = new Date();
        end.setDate(end.getDate() + days - 1);
        med.endDate = toISODate(end);
      }
      saveMedicine(med);
    });
    onClose();
  };

  return (
    <Modal
      title="Add medicines from a prescription"
      subtitle="Paste the text from the prescription. You confirm every row before it is saved."
      onClose={onClose}
    >
      {!result ? (
        <>
          <Field label="Prescription text" hint="Scanned or typed — the AI only structures what is written here.">
            {(id) => (
              <textarea
                id={id}
                style={{ minHeight: 150 }}
                placeholder={'e.g.\nTab. Metformin 500mg — 1 BD after food × 30 days\nTab. Thyronorm 50mcg — 1 OD before breakfast'}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}
          </Field>
          {error && <p className="ai-disclaimer" role="alert">{error}</p>}
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="btn" disabled={loading || !text.trim()} onClick={run}>
              <Sparkles size={17} /> {loading ? 'Reading…' : 'Read prescription'}
            </button>
          </div>
        </>
      ) : (
        <>
          <AiBanner meta={result.meta} />
          {result.doctorName && <p className="card__sub"><ScanLine size={14} /> Prescribed by {result.doctorName}</p>}

          {result.medicines.length === 0 ? (
            <p>No medicines could be read from that text. Try pasting a cleaner scan.</p>
          ) : (
            result.medicines.map((m, i) => (
              <label className="extracted" key={`${m.medicineName}-${i}`}>
                <input
                  type="checkbox"
                  checked={chosen.has(i)}
                  onChange={(e) => {
                    const next = new Set(chosen);
                    if (e.target.checked) next.add(i); else next.delete(i);
                    setChosen(next);
                  }}
                />
                <span className="extracted__main">
                  <span className="extracted__name">{m.medicineName} {m.dosage}</span>
                  <span className="extracted__meta">
                    {m.frequency}× daily
                    {m.times.length > 0 && ` · ${m.times.join(', ')}`}
                    {m.duration && ` · ${m.duration}`}
                  </span>
                </span>
              </label>
            ))
          )}

          {result.unreadable.length > 0 && (
            <div className="ai-disclaimer">
              Could not read with confidence: {result.unreadable.join('; ')}. Please check these
              against the paper prescription.
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
            <button type="button" className="btn btn--ghost" onClick={() => setResult(null)}>Back</button>
            <button type="button" className="btn" disabled={chosen.size === 0} onClick={save}>
              Add {chosen.size} medicine{chosen.size === 1 ? '' : 's'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

