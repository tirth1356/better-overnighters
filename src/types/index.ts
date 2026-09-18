// ─── Shared Domain Types for FamilyCare ───
// These types are shared across all developers on the team.
// Import from "@/types" in your components.

// ─── User / Auth ─────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  familyId?: string;
  avatarUrl?: string;
}

// ─── Family ──────────────────────────────────────────────────────
export interface Family {
  id: string;
  name: string;
  ownerId: string;
  members: FamilyMember[];
  createdAt: string;
}

// ─── Family Member ────────────────────────────────────────────────
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type BloodGroup =
  | 'A+' | 'A-'
  | 'B+' | 'B-'
  | 'AB+' | 'AB-'
  | 'O+' | 'O-'
  | 'Unknown';

export type Relationship =
  | 'Self'
  | 'Spouse'
  | 'Son'
  | 'Daughter'
  | 'Father'
  | 'Mother'
  | 'Grandfather'
  | 'Grandmother'
  | 'Brother'
  | 'Sister'
  | 'Uncle'
  | 'Aunt'
  | 'Other'
  | string;

export interface FamilyMember {
  id: string;
  name: string;
  relationship: Relationship;
  relation?: string; // Person 3 compat
  dateOfBirth: string;        // ISO date string: YYYY-MM-DD
  gender: Gender;
  bloodGroup: BloodGroup;
  avatarUrl?: string;
  photo?: string; // Person 3 compat
  avatarInitials?: string;    // fallback: "TH", "MOM" etc.
  avatarColor?: string;       // CSS hex for the initials avatar bg
  allergies: string[];
  conditions: string[];       // existing medical conditions
  emergencyContact?: string;  // phone number
  emergencyContactName?: string;
  notes?: string;
  // counts — populated from other modules at runtime
  activeMedicineCount?: number;
  medicalRecordCount?: number;
}

// ─── Doctor ──────────────────────────────────────────────────────
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialization?: string; // Person 3 compat
  hospital?: string;
  clinic?: string; // Person 3 compat
  phone?: string;
  email?: string;
  address?: string;
  familyMemberIds: string[];  // which members see this doctor
  avatarUrl?: string;
  notes?: string;
}

// ─── Medical Record ──────────────────────────────────────────────
export type MedicalRecordType =
  | 'Lab Report'
  | 'Prescription'
  | 'Imaging'
  | 'Discharge Summary'
  | 'Vaccination'
  | 'Consultation'
  | 'Other';

export interface MedicalRecord {
  id: string;
  familyMemberId: string;
  title: string;
  type: MedicalRecordType;
  kind?: 'report' | 'prescription'; // Person 3 compat
  date: string;               // ISO date
  doctorId?: string;
  doctorName?: string;
  hospital?: string;
  fileUrl?: string;
  summary?: string;           // AI-generated summary (Person 4)
  tags?: string[];
  notes?: string;
}

export type MedicalRecordRef = MedicalRecord; // Person 3 compat alias

// ─── Prescription ────────────────────────────────────────────────
export interface Prescription {
  id: string;
  familyMemberId: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  medicines: Medicine[];
  notes?: string;
  fileUrl?: string;
  aiExplanation?: string;     // Person 4 — AI explanation
}

// ─── Medicine ────────────────────────────────────────────────────
export type MedicineFrequency =
  | 'Once daily'
  | 'Twice daily'
  | 'Three times daily'
  | 'As needed'
  | 'Weekly'
  | 'Other'
  | number; // Person 3 compat

export type MedicineTiming = 'Before meal' | 'After meal' | 'With meal' | 'Anytime';
export type MealRelation = 'before_food' | 'after_food' | 'with_food' | 'any'; // Person 3 compat

export interface MedicineDose {
  id: string;
  medicineId: string;
  scheduledTime: string;      // HH:MM
  taken: boolean;
  takenAt?: string;           // ISO timestamp when actually taken
  date: string;               // YYYY-MM-DD
}

export type DoseStatus = 'taken' | 'pending' | 'missed' | 'skipped';

export interface DoseLog {
  id: string;
  medicineId: string;
  date: string;
  time: string;
  status: Exclude<DoseStatus, 'pending'>;
  recordedAt: string;
}

export interface Medicine {
  id: string;
  familyMemberId: string;
  prescriptionId?: string;
  name: string;
  dosage: string;             // e.g. "500mg"
  frequency: MedicineFrequency;
  times?: string[];           // Person 3 compat
  timing: MedicineTiming;
  beforeAfterFood?: MealRelation; // Person 3 compat
  startDate: string;
  endDate?: string;
  duration?: number;          // Person 3 compat
  isActive: boolean;
  refillDate?: string;
  purpose?: string;
  sideEffects?: string[];
  doses?: MedicineDose[];
  doctorId?: string;          // Person 3 compat
  notes?: string;
}

// ─── Vaccination ─────────────────────────────────────────────────
export type VaccinationStatus = 'completed' | 'upcoming' | 'overdue';

export interface Vaccination {
  id: string;
  familyMemberId: string;
  name: string;
  vaccine?: string;           // Person 3 compat
  dose?: string;              // Person 3 compat
  dateAdministered: string;
  date?: string;              // Person 3 compat
  nextDueDate?: string;
  doctorId?: string;
  hospital?: string;
  batchNumber?: string;
  document?: string;          // Person 3 compat
  notes?: string;
}

// ─── Appointment ─────────────────────────────────────────────────
export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface Appointment {
  id: string;
  familyMemberId: string;
  doctorId?: string;
  doctorName: string;
  specialty: string;
  hospital?: string;
  dateTime: string;           // ISO timestamp
  status: AppointmentStatus;
  notes?: string;
  reminder?: boolean;
}

// ─── Emergency Profile ────────────────────────────────────────────
export interface EmergencyProfile {
  familyMemberId: string;
  bloodGroup: BloodGroup;
  allergies: string[];
  conditions: string[];
  currentMedicines: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  doctorName?: string;
  doctorPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
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

// ─── Dashboard Summary (for Person 1 dashboard) ──────────────────
export interface DashboardStats {
  totalMembers: number;
  activeMedicines: number;
  totalRecords: number;
  upcomingAppointments: number;
}

export interface MemberHealthSummary {
  member: FamilyMember;
  medicinesTaken: number;
  medicinesTotal: number;
  recordCount: number;
  lastRecordDate?: string;
}

// ─── Document & Vault Types ──────────────────────────────────────
export type DocumentType =
  | 'blood_report'
  | 'prescription'
  | 'xray'
  | 'ct_mri'
  | 'discharge_summary'
  | 'lab_report'
  | 'vaccination_record'
  | 'other'
  | string;

export interface RecordFilters {
  searchQuery: string;
  familyMemberId: string;
  documentType: string;
  doctorId: string;
  dateFrom: string;
  dateTo: string;
}

export interface MedicalTimelineEvent {
  id: string;
  familyMemberId: string;
  date: string;
  title: string;
  type: 'record' | 'vaccination' | 'appointment' | string;
  description?: string;
  recordId?: string;
}
