import { AlertTriangle, Droplet, Pencil, Phone, QrCode, Stethoscope, TriangleAlert, User } from 'lucide-react';
import { useState } from 'react';
import { Field, Modal } from '../../components/ui';
import { initials, useMember } from '../../lib/member';
import { saveEmergencyCard, useDB } from '../../lib/store';
import type { EmergencyCard } from '../../types';
import { emergencyPayload } from './emergencyPayload';
import './emergency.css';

const toList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

function EmergencyForm({
  card, onClose,
}: { card: EmergencyCard; onClose: () => void }) {
  const { doctors } = useDB();
  const [draft, setDraft] = useState(card);
  const set = <K extends keyof EmergencyCard>(k: K, v: EmergencyCard[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Modal
      title="Edit emergency card"
      subtitle="Keep this short — it is read in a hurry."
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveEmergencyCard(draft);
          onClose();
        }}
      >
        <div className="form-row">
          <Field label="Blood group">
            {(id) => (
              <input id={id} placeholder="B+" value={draft.bloodGroup ?? ''}
                onChange={(e) => set('bloodGroup', e.target.value)} />
            )}
          </Field>
          <Field label="Primary doctor">
            {(id) => (
              <select id={id} value={draft.primaryDoctorId ?? ''}
                onChange={(e) => set('primaryDoctorId', e.target.value || undefined)}>
                <option value="">Not set</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            )}
          </Field>
        </div>
        <Field label="Allergies" hint="Separate with commas.">
          {(id) => (
            <input id={id} placeholder="Penicillin, peanuts"
              value={draft.allergies.join(', ')}
              onChange={(e) => set('allergies', toList(e.target.value))} />
          )}
        </Field>
        <Field label="Important conditions" hint="Separate with commas.">
          {(id) => (
            <input id={id} placeholder="Type 2 diabetes, asthma"
              value={draft.conditions.join(', ')}
              onChange={(e) => set('conditions', toList(e.target.value))} />
          )}
        </Field>
        <div className="form-row">
          <Field label="Emergency contact name">
            {(id) => (
              <input id={id} value={draft.emergencyContactName ?? ''}
                onChange={(e) => set('emergencyContactName', e.target.value)} />
            )}
          </Field>
          <Field label="Emergency contact phone">
            {(id) => (
              <input id={id} type="tel" value={draft.emergencyContactPhone ?? ''}
                onChange={(e) => set('emergencyContactPhone', e.target.value)} />
            )}
          </Field>
        </div>
        <Field label="Notes">
          {(id) => (
            <textarea id={id} value={draft.notes ?? ''} onChange={(e) => set('notes', e.target.value)}
              placeholder="e.g. carries an inhaler in her school bag" />
          )}
        </Field>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Save card</button>
        </div>
      </form>
    </Modal>
  );
}

export default function EmergencyPage() {
  const { member } = useMember();
  const { emergency, doctors } = useDB();
  const [editing, setEditing] = useState(false);

  if (!member) return null;

  const card: EmergencyCard = emergency.find((c) => c.familyMemberId === member.id) ?? {
    familyMemberId: member.id,
    allergies: [],
    conditions: [],
  };
  const doctor = doctors.find((d) => d.id === card.primaryDoctorId);
  const data = emergencyPayload(member, card, doctor);

  return (
    <>
      <header className="page-head">
        <div className="page-head__row">
          <div>
            <h1>Emergency card</h1>
            <p>What a paramedic or relative needs to know in the first ten seconds.</p>
          </div>
          <button type="button" className="btn btn--ghost" onClick={() => setEditing(true)}>
            <Pencil size={17} /> Edit card
          </button>
        </div>
      </header>

      <article className="ec">
        <div className="ec__banner">
          <TriangleAlert size={18} aria-hidden="true" /> Emergency medical information
        </div>

        <div className="ec__identity">
          {member.photo
            ? <img className="ec__photo" src={member.photo} alt="" />
            : <span className="ec__photo" aria-hidden="true">{initials(member.name)}</span>}
          <div>
            <div className="ec__name">{data.name}</div>
            <div className="ec__rel">
              {member.relation}
              {member.dateOfBirth && ` · born ${member.dateOfBirth}`}
            </div>
          </div>
          <div className="ec__blood">
            <div className="ec__blood-value">{data.bloodGroup}</div>
            <div className="ec__blood-label"><Droplet size={11} /> Blood group</div>
          </div>
        </div>

        <div className="ec__rows">
          <div className="ec__row">
            <div className="ec__label"><AlertTriangle size={13} /> Allergies</div>
            {data.allergies.length === 0 ? (
              <div className="ec__value">None recorded</div>
            ) : (
              <div className="ec__list">
                {data.allergies.map((a) => <span key={a} className="ec__chip">{a}</span>)}
              </div>
            )}
          </div>

          <div className="ec__row">
            <div className="ec__label">Important conditions</div>
            {data.conditions.length === 0 ? (
              <div className="ec__value">None recorded</div>
            ) : (
              <div className="ec__list">
                {data.conditions.map((c) => <span key={c} className="ec__chip ec__chip--calm">{c}</span>)}
              </div>
            )}
          </div>

          <div className="ec__row">
            <div className="ec__label"><User size={13} /> Emergency contact</div>
            <div className="ec__value">{data.emergencyContact.name || 'Not set'}</div>
            {data.emergencyContact.phone && (
              <div className="ec__value ec__value--critical">
                <a href={`tel:${data.emergencyContact.phone.replace(/\s/g, '')}`}>
                  <Phone size={16} /> {data.emergencyContact.phone}
                </a>
              </div>
            )}
          </div>

          <div className="ec__row">
            <div className="ec__label"><Stethoscope size={13} /> Primary doctor</div>
            <div className="ec__value">{data.primaryDoctor?.name ?? 'Not set'}</div>
            {data.primaryDoctor?.phone && (
              <div className="ec__value ec__value--critical">
                <a href={`tel:${data.primaryDoctor.phone.replace(/\s/g, '')}`}>
                  <Phone size={16} /> {data.primaryDoctor.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {data.notes && (
          <div className="ec__row" style={{ borderBottom: 'none' }}>
            <div className="ec__label">Notes</div>
            <div className="ec__value">{data.notes}</div>
          </div>
        )}

        <div className="ec__foot">
          <div className="ec__qr" aria-hidden="true"><QrCode size={30} /></div>
          <p className="card__sub" style={{ margin: 0 }}>
            QR access is not enabled yet. The card is already published as a flat payload
            (<code>emergencyPayload</code>), so a scannable code can encode it as-is.
          </p>
        </div>
      </article>

      {editing && <EmergencyForm card={card} onClose={() => setEditing(false)} />}
    </>
  );
}
