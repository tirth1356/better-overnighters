import type { Doctor, MealRelation, Medicine, Vaccination } from '@/types';

/**
 * Person 1's shared types and Person 3's modules describe the same records with
 * different field names (`specialty`/`specialization`, `name`/`vaccine`,
 * `timing`/`beforeAfterFood`). These readers accept either shape so no screen
 * has to know which module wrote the record.
 */

const DEFAULT_TIMES: Record<number, string[]> = {
  1: ['08:00'],
  2: ['08:00', '20:00'],
  3: ['08:00', '14:00', '20:00'],
  4: ['08:00', '12:00', '16:00', '20:00'],
};

/**
 * Dose times for a medicine. Explicit `times` win; otherwise they are derived
 * from the frequency. "As needed" has no schedule and returns none — it must
 * never appear as a missed dose.
 */
export function doseTimes(m: Medicine): string[] {
  if (m.times && m.times.length > 0) return m.times;
  const f = m.frequency;
  if (typeof f === 'number') return DEFAULT_TIMES[f] ?? DEFAULT_TIMES[1];
  switch (f) {
    case 'Once daily': return DEFAULT_TIMES[1];
    case 'Twice daily': return DEFAULT_TIMES[2];
    case 'Three times daily': return DEFAULT_TIMES[3];
    case 'Weekly': return DEFAULT_TIMES[1];
    default: return []; // "As needed" / "Other" — no fixed schedule
  }
}

/** How many doses a day this medicine asks for. */
export const dosesPerDay = (m: Medicine): number => doseTimes(m).length;

export function mealRelation(m: Medicine): MealRelation {
  if (m.beforeAfterFood) return m.beforeAfterFood;
  switch (m.timing) {
    case 'Before meal': return 'before_food';
    case 'After meal': return 'after_food';
    case 'With meal': return 'with_food';
    default: return 'any';
  }
}

/** A weekly medicine is only due on the same weekday as its start date. */
export function repeatsOnDate(m: Medicine, date: string): boolean {
  if (m.frequency !== 'Weekly') return true;
  const day = (iso: string) => new Date(`${iso}T00:00:00`).getDay();
  return day(date) === day(m.startDate);
}

export const doctorSpecialty = (d: Doctor): string => d.specialization ?? d.specialty ?? '';

export const vaccineName = (v: Vaccination): string => v.vaccine ?? v.name ?? '';

/** Date the dose was actually given, or undefined when only scheduled. */
export const vaccineDate = (v: Vaccination): string | undefined =>
  v.date ?? v.dateAdministered ?? undefined;
