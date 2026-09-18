import { Check, Pencil, Pill, Plus, SkipForward, Trash2, Undo2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card, EmptyState } from '../../components/ui';
import { useMember } from '../../lib/member';
import {
  addDays, adherence, adherenceOverDays, fromISODate, scheduleFor, toISODate,
} from '../../lib/schedule';
import { deleteMedicine, setDoseStatus, useDB } from '../../lib/store';
import type { DoseStatus, MealRelation, Medicine } from '../../types';
import MedicineCalendar from './MedicineCalendar';
import MedicineForm from './MedicineForm';
import './medicines.css';

const MEAL_LABEL: Record<MealRelation, string> = {
  before_food: 'Before food',
  after_food: 'After food',
  with_food: 'With food',
  any: 'Anytime',
};

const STATUS_LABEL: Record<DoseStatus, string> = {
  taken: 'Taken',
  pending: 'Pending',
  missed: 'Missed',
  skipped: 'Skipped',
};

/** 12-hour label — easier to read for older family members than 20:00. */
function pretty(time: string) {
  const [h, m] = time.split(':').map(Number);
  const suffix = h < 12 ? 'AM' : 'PM';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
}

function longDate(iso: string) {
  return fromISODate(iso).toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

export default function MedicinesPage() {
  const { member } = useMember();
  const { medicines, doses, doctors } = useDB();
  const today = toISODate(new Date());
  const [selected, setSelected] = useState(today);
  const [form, setForm] = useState<{ open: boolean; editing?: Medicine }>({ open: false });

  const mine = useMemo(
    () => medicines.filter((m) => m.familyMemberId === member?.id),
    [medicines, member?.id],
  );

  const slots = scheduleFor(mine, doses, selected, today);
  const todayStats = adherence(scheduleFor(mine, doses, today, today));
  const weekly = adherenceOverDays(mine, doses, today, 7, today);
  const weekBars = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i - 6);
    return { date, ...adherence(scheduleFor(mine, doses, date, today)) };
  });

  const doctorName = (id?: string) => doctors.find((d) => d.id === id)?.name;

  return (
    <>
      <header className="page-head">
        <div className="page-head__row">
          <div>
            <h1>Medicines</h1>
            <p>{member?.name}’s daily doses, in one place.</p>
          </div>
          <button type="button" className="btn" onClick={() => setForm({ open: true })}>
            <Plus size={18} /> Add medicine
          </button>
        </div>
      </header>

      <div className="adherence" style={{ marginBottom: 'var(--space-5)' }}>
        <Card className="card--flat">
          <div className="adherence__stat">
            <div className="ring" style={{ '--pct': todayStats.percent } as React.CSSProperties}>
              <span className="ring__inner">{todayStats.percent}%</span>
            </div>
            <div>
              <div className="adherence__value">
                {todayStats.taken} / {todayStats.total - todayStats.skipped}
              </div>
              <div className="adherence__label">doses taken today</div>
            </div>
          </div>
        </Card>

        <Card className="card--flat">
          <div className="adherence__value">{weekly.percent}%</div>
          <div className="adherence__label">last 7 days</div>
          <div className="week-bars" style={{ marginTop: 'var(--space-3)' }}>
            {weekBars.map((b) => {
              const tone = b.total === 0 ? 'none' : b.percent >= 80 ? '' : 'low';
              return (
                <div key={b.date} className="week-bar">
                  <div
                    className={`week-bar__fill ${tone ? `week-bar__fill--${tone}` : ''}`}
                    style={{ height: `${b.total === 0 ? 8 : Math.max(b.percent, 8)}%` }}
                    title={`${b.date}: ${b.taken}/${b.total} taken`}
                  />
                  <span className="week-bar__day">{longDate(b.date).slice(0, 2)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="card--flat">
          <div className="adherence__value">{weekly.missed}</div>
          <div className="adherence__label">missed doses this week</div>
          <p className="card__sub" style={{ marginTop: 'var(--space-3)' }}>
            {weekly.missed === 0
              ? 'Nothing missed — well done.'
              : 'Tap a past day in the calendar to record what actually happened.'}
          </p>
        </Card>
      </div>

      <div className="med-layout">
        <Card title="Calendar">
          <MedicineCalendar
            medicines={mine}
            doses={doses}
            selected={selected}
            onSelect={setSelected}
          />
        </Card>

        <Card
          title={selected === today ? 'Today' : longDate(selected)}
          subtitle={`${slots.length} dose${slots.length === 1 ? '' : 's'} scheduled`}
        >
          {slots.length === 0 ? (
            <EmptyState
              icon={<Pill size={34} />}
              title="No doses on this day"
              hint="Medicines appear here between their start and end dates."
            />
          ) : (
            slots.map((slot) => (
              <div className="dose" key={`${slot.medicine.id}-${slot.time}`}>
                <div className="dose__time">{pretty(slot.time)}</div>
                <div className="dose__body">
                  <div className="dose__name">
                    {slot.medicine.name} {slot.medicine.dosage}
                  </div>
                  <div className="dose__meta">
                    {MEAL_LABEL[slot.medicine.beforeAfterFood]}
                    {doctorName(slot.medicine.doctorId) && ` · ${doctorName(slot.medicine.doctorId)}`}
                  </div>
                </div>
                <div className="dose__actions">
                  {slot.status === 'pending' || slot.status === 'missed' ? (
                    <>
                      <button
                        type="button"
                        className="btn btn--sage btn--sm"
                        onClick={() => setDoseStatus(slot.medicine.id, selected, slot.time, 'taken')}
                      >
                        <Check size={15} /> Taken
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => setDoseStatus(slot.medicine.id, selected, slot.time, 'skipped')}
                      >
                        <SkipForward size={15} /> Skip
                      </button>
                      {slot.status === 'missed' && <span className="pill pill--missed">Missed</span>}
                    </>
                  ) : (
                    <>
                      <span className={`pill pill--${slot.status}`}>{STATUS_LABEL[slot.status]}</span>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => setDoseStatus(slot.medicine.id, selected, slot.time, 'pending')}
                      >
                        <Undo2 size={15} /> Undo
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </Card>
      </div>

      <div className="section-title">
        <h2>All medicines</h2>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          icon={<Pill size={34} />}
          title="No medicines yet"
          hint={`Add ${member?.name}’s first medicine to start tracking doses.`}
          action={
            <button type="button" className="btn" onClick={() => setForm({ open: true })}>
              <Plus size={18} /> Add medicine
            </button>
          }
        />
      ) : (
        <div className="grid grid--3">
          {mine.map((m) => (
            <Card key={m.id}>
              <div className="med-card">
                <span className="med-card__icon">
                  {m.photo ? <img src={m.photo} alt="" /> : <Pill size={22} />}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="med-card__name">{m.name}</div>
                  <div className="med-card__dose">
                    {m.dosage} · {m.frequency}× daily
                  </div>
                  {m.notes && <p className="card__sub">{m.notes}</p>}
                </div>
              </div>
              <div className="med-card__tags">
                {m.times.map((t) => <span key={t} className="pill">{pretty(t)}</span>)}
                <span className="pill">{MEAL_LABEL[m.beforeAfterFood]}</span>
                {doctorName(m.doctorId) && <span className="pill">{doctorName(m.doctorId)}</span>}
                <span className="pill">
                  {m.endDate ? `Until ${m.endDate}` : 'Ongoing'}
                </span>
              </div>
              <div className="med-card__actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setForm({ open: true, editing: m })}
                >
                  <Pencil size={15} /> Edit
                </button>
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  onClick={() => {
                    if (confirm(`Remove ${m.name} and its dose history?`)) deleteMedicine(m.id);
                  }}
                >
                  <Trash2 size={15} /> Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {form.open && member && (
        <MedicineForm
          familyMemberId={member.id}
          editing={form.editing}
          onClose={() => setForm({ open: false })}
        />
      )}
    </>
  );
}
