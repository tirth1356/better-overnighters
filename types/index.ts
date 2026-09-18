/* =========================================================
   Core TypeScript types for Better Overnighters
   =========================================================
   Person 1: FamilyMember, User, AuthContext (stubs here)
   Person 2: MedicalRecord, Prescription, Doctor, Timeline
   Person 4: AIChat, CopilotSession (reserved — not implemented)
   ========================================================= */

// ── Enums ─────────────────────────────────────────────────

export type DocumentType =
  | 'blood_report'
  | 'prescription'
  | 'xray'
  | 'ct_mri'
  | 'discharge_summary'
  | 'lab_report'
  | 'vaccination_record'
  | 'other'

export type Gender = 'male' | 'female' | 'other'

export type Relationship =
  | 'self'
  | 'spouse'
  | 'father'
  | 'mother'
  | 'son'
  | 'daughter'
  | 'grandfather'
  | 'grandmother'
  | 'brother'
  | 'sister'
  | 'other'

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type Language = 'en' | 'hi' | 'gu'

// ── Person 1 Stub Types ────────────────────────────────────
// Person 1 will extend and replace these with full implementations

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface FamilyMember {
  id: string
  name: string
  dateOfBirth: string         // ISO date string
  gender: Gender
  relationship: Relationship
  bloodGroup?: BloodGroup
  avatarUrl?: string
  allergies?: string[]
  chronicConditions?: string[]
  primaryDoctorId?: string
}

// ── Doctors ────────────────────────────────────────────────

export interface Doctor {
  id: string
  name: string
  specialization: string
  hospital: string
  phone?: string
  email?: string
  avatarUrl?: string
}

// ── Medical Records ────────────────────────────────────────

export interface MedicalRecord {
  id: string
  familyMemberId: string      // references FamilyMember.id
  documentType: DocumentType
  title: string
  medicalDate: string         // ISO date string — date of the report/visit
  uploadedAt: string          // ISO date string — when user uploaded it
  doctorId?: string           // references Doctor.id
  hospital?: string
  fileUrl?: string            // URL or local blob
  thumbnailUrl?: string       // preview image
  tags: string[]
  notes?: string
  hasAIExplanation?: boolean  // whether AI has explained this record
}

// ── Prescriptions ──────────────────────────────────────────

export interface PrescriptionMedicine {
  id: string
  name: string
  dosage: string              // e.g. "500mg"
  frequency: string           // e.g. "Twice daily"
  duration: string            // e.g. "30 days"
  instructions?: string       // e.g. "After meals"
  quantity?: number
}

export interface Prescription {
  id: string
  recordId: string            // references MedicalRecord.id
  familyMemberId: string
  doctorId?: string
  medicines: PrescriptionMedicine[]
  issuedDate: string
  notes?: string
}

// ── Medical Timeline ───────────────────────────────────────

export type TimelineEventType =
  | 'record_added'
  | 'doctor_visit'
  | 'prescription'
  | 'vaccination'
  | 'lab_result'
  | 'surgery'
  | 'hospitalization'

export interface MedicalTimelineEvent {
  id: string
  familyMemberId: string
  eventType: TimelineEventType
  title: string
  date: string                // ISO date string
  doctorId?: string
  hospital?: string
  recordId?: string           // link to MedicalRecord if present
  summary?: string
  isHighlighted?: boolean     // e.g., abnormal result, important event
}

// ── AI Service Types ───────────────────────────────────────
// These interfaces let Person 4 swap in real LLM implementations

export interface AIExplanationSection {
  title: string
  content: string
}

export interface AIKeyTerm {
  term: string
  explanation: string
}

export interface AILabValue {
  parameter: string
  value: string
  unit: string
  referenceRange: string
  status: 'normal' | 'low' | 'high' | 'critical'
}

export interface AIExplanation {
  recordId: string
  language: Language
  generatedAt: string
  simpleExplanation: string
  keyTerms: AIKeyTerm[]
  labValues: AILabValue[]
  questionsForDoctor: string[]
  importantNotice: string
  disclaimer: string
  isLoading?: boolean
  error?: string
}

export interface ExtractedMedicine {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  confidence: number          // 0–1, how confident the extraction is
}

export interface ExtractedPrescription {
  rawText?: string
  medicines: ExtractedMedicine[]
  doctorName?: string
  hospitalName?: string
  date?: string
  confidence: number
  needsReview: boolean        // flag for low-confidence extractions
}

export interface ReportComparisonParameter {
  parameter: string
  unit: string
  referenceRange: string
  values: Record<string, string>  // key: recordId, value: result string
  trend: 'improving' | 'worsening' | 'stable' | 'unknown'
}

export interface ReportComparison {
  recordIds: string[]
  parameters: ReportComparisonParameter[]
  summary: string
  generatedAt: string
}

// ── Storage Service Types ──────────────────────────────────

export interface UploadedFile {
  id: string
  fileUrl: string
  thumbnailUrl?: string
  fileName: string
  fileType: string            // MIME type
  fileSize: number            // bytes
  uploadedAt: string
}

// ── Filter/Search Types ────────────────────────────────────

export interface RecordFilters {
  searchQuery: string
  familyMemberId: string | 'all'
  documentType: DocumentType | 'all'
  doctorId: string | 'all'
  dateFrom: string
  dateTo: string
}
