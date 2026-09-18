/**
 * Domain types owned by Person 3 (medicines, doctors, vaccinations, emergency).
 *
 * FamilyMember is declared here only as a minimal placeholder so these modules
 * compile standalone. When Person 1's family module lands, delete this block and
 * re-export their type instead — the rest of these files only rely on `id`.
 */
export interface FamilyMember {
  id: string;
  name: string;
  photo?: string;
  relation?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
}

export type MealRelation = 'before_food' | 'after_food' | 'with_food' | 'any';

export interface Medicine {
  id: string;
  familyMemberId: string;
  name: string;
  photo?: string;
  dosage: string;
  /** Doses per day; `times` is the source of truth for scheduling. */
  frequency: number;
  /** "HH:MM" 24h strings, e.g. ["08:00", "20:00"]. */
  times: string[];
  startDate: string;
  endDate?: string;
  /** Days. Derived from start/end when both are known. */
  duration?: number;
  beforeAfterFood: MealRelation;
  doctorId?: string;
  prescriptionId?: string;
  notes?: string;
}

export type DoseStatus = 'taken' | 'pending' | 'missed' | 'skipped';

/** One dose on one day. Only non-pending doses are persisted. */
export interface DoseLog {
  id: string;
  medicineId: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:MM" — matches an entry in Medicine.times */
  time: string;
  status: Exclude<DoseStatus, 'pending'>;
  recordedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone?: string;
  email?: string;
  hospital?: string;
  clinic?: string;
  address?: string;
  notes?: string;
}

export type VaccinationStatus = 'completed' | 'upcoming' | 'overdue';

export interface Vaccination {
  id: string;
  familyMemberId: string;
  vaccine: string;
  dose: string;
  /** Date given. Empty while the dose is only scheduled. */
  date?: string;
  nextDueDate?: string;
  document?: string;
  notes?: string;
}

export interface EmergencyCard {
  familyMemberId: string;
  bloodGroup?: string;
  allergies: string[];
  conditions: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  primaryDoctorId?: string;
  notes?: string;
}

/** Person 2 owns records; referenced here only for doctor association. */
export interface MedicalRecordRef {
  id: string;
  familyMemberId: string;
  title: string;
  kind: 'report' | 'prescription';
  date: string;
  doctorId?: string;
}
