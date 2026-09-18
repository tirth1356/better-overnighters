import type { Vaccination, VaccinationStatus } from '../types';

/**
 * A dose is overdue once its next-due date has passed, upcoming while that date
 * is still ahead, and completed when it was given with nothing further due.
 */
export function vaccinationStatus(v: Vaccination, today: string): VaccinationStatus {
  if (v.nextDueDate) return v.nextDueDate < today ? 'overdue' : 'upcoming';
  return v.date ? 'completed' : 'upcoming';
}
