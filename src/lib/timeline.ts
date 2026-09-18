import type { Appointment, MedicalRecord, Medicine, Vaccination } from '@/types';
import { recordKind, vaccineDate, vaccineName } from './normalize.ts';

/**
 * The medical timeline is derived from the records the family already has —
 * never from a separate event list. A parallel list would drift the moment a
 * record, medicine or vaccination changed, and would file events under ids that
 * no longer exist.
 */
export type TimelineKind = 'report' | 'prescription' | 'medicine' | 'vaccination' | 'appointment';

export interface TimelineEvent {
  id: string;
  date: string;
  kind: TimelineKind;
  title: string;
  detail?: string;
  doctorId?: string;
  recordId?: string;
}

export interface TimelineSource {
  records: MedicalRecord[];
  medicines: Medicine[];
  vaccinations: Vaccination[];
  appointments: Appointment[];
}

/** Every dated event for one family member, newest first. */
export function buildTimeline(src: TimelineSource, familyMemberId: string): TimelineEvent[] {
  const mine = <T extends { familyMemberId: string }>(list: T[]) =>
    list.filter((x) => x.familyMemberId === familyMemberId);

  const events: TimelineEvent[] = [];

  for (const r of mine(src.records)) {
    events.push({
      id: `record-${r.id}`,
      date: r.date,
      kind: recordKind(r),
      title: r.title,
      detail: r.summary ?? r.hospital,
      doctorId: r.doctorId,
      recordId: r.id,
    });
  }

  for (const m of mine(src.medicines)) {
    events.push({
      id: `medicine-${m.id}`,
      date: m.startDate,
      kind: 'medicine',
      title: `Started ${m.name}${m.dosage ? ` ${m.dosage}` : ''}`,
      detail: m.purpose ?? m.notes,
      doctorId: m.doctorId,
    });
  }

  for (const v of mine(src.vaccinations)) {
    const given = vaccineDate(v);
    if (!given) continue; // only scheduled — it belongs on the vaccination page, not history
    events.push({
      id: `vaccination-${v.id}`,
      date: given,
      kind: 'vaccination',
      title: vaccineName(v),
      detail: v.dose ? `${v.dose}${v.hospital ? ` · ${v.hospital}` : ''}` : v.hospital,
      doctorId: v.doctorId,
    });
  }

  for (const a of mine(src.appointments ?? [])) {
    events.push({
      id: `appointment-${a.id}`,
      date: a.dateTime.slice(0, 10),
      kind: 'appointment',
      title: `${a.status === 'Completed' ? 'Saw' : 'Appointment with'} ${a.doctorName}`,
      detail: [a.specialty, a.hospital].filter(Boolean).join(' · '),
      doctorId: a.doctorId,
    });
  }

  return events
    .filter((e) => e.date)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

/** Events grouped under a "September 2026" style heading, in timeline order. */
export function groupByMonth(events: TimelineEvent[]): { label: string; events: TimelineEvent[] }[] {
  const groups: { label: string; events: TimelineEvent[] }[] = [];
  for (const e of events) {
    const label = new Date(`${e.date}T00:00:00`).toLocaleDateString(undefined, {
      month: 'long', year: 'numeric',
    });
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.events.push(e);
    else groups.push({ label, events: [e] });
  }
  return groups;
}
