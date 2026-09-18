import type { DoseLog, DoseStatus, Medicine } from '../types';

/** Local-date ISO string ("YYYY-MM-DD") — never UTC, doses are local events. */
export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function isActiveOn(med: Medicine, date: string): boolean {
  if (date < med.startDate) return false;
  if (med.endDate && date > med.endDate) return false;
  return true;
}

export interface DoseSlot {
  medicine: Medicine;
  time: string;
  status: DoseStatus;
}

/**
 * Every dose due on `date`, with its status.
 *
 * A slot with no log is `pending` today or in the future, and `missed` once the
 * day is over — a dose nobody ticked yesterday was not taken.
 */
export function scheduleFor(
  medicines: Medicine[],
  doses: DoseLog[],
  date: string,
  today: string = toISODate(new Date()),
): DoseSlot[] {
  const slots: DoseSlot[] = [];
  for (const medicine of medicines) {
    if (!isActiveOn(medicine, date)) continue;
    for (const time of medicine.times) {
      const log = doses.find(
        (x) => x.medicineId === medicine.id && x.date === date && x.time === time,
      );
      const status: DoseStatus = log ? log.status : date < today ? 'missed' : 'pending';
      slots.push({ medicine, time, status });
    }
  }
  return slots.sort((a, b) => a.time.localeCompare(b.time));
}

export interface Adherence {
  taken: number;
  pending: number;
  missed: number;
  skipped: number;
  total: number;
  /** Taken / (total - skipped), 0-100. Skipped doses are excluded, not penalised. */
  percent: number;
}

export function adherence(slots: DoseSlot[]): Adherence {
  const count = (s: DoseStatus) => slots.filter((x) => x.status === s).length;
  const taken = count('taken');
  const skipped = count('skipped');
  const considered = slots.length - skipped;
  return {
    taken,
    pending: count('pending'),
    missed: count('missed'),
    skipped,
    total: slots.length,
    percent: considered > 0 ? Math.round((taken / considered) * 100) : 0,
  };
}

/** Adherence across the `days` days ending on `date` (inclusive). */
export function adherenceOverDays(
  medicines: Medicine[],
  doses: DoseLog[],
  date: string,
  days: number,
  today?: string,
): Adherence {
  const slots: DoseSlot[] = [];
  for (let i = 0; i < days; i++) {
    slots.push(...scheduleFor(medicines, doses, addDays(date, -i), today));
  }
  return adherence(slots);
}

/** Days in `month` (0-indexed) laid out Monday-first, padded with null. */
export function calendarGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday = 0
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= total; d++) cells.push(toISODate(new Date(year, month, d)));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
