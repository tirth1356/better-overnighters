// ─── Centralized Mock Data for FamilyCare ───
// All demo data lives here. Other developers extend this data model.
// Import from "@/data/mockData" in your components.

import type {
  FamilyMember,
  Doctor,
  MedicalRecord,
  Medicine,
  Vaccination,
  Appointment,
  Family,
  User,
} from '@/types';

// ─── Mock User ────────────────────────────────────────────────────
export const mockUser: User = {
  id: 'user-001',
  name: 'Tirth Patel',
  email: 'tirth@familycare.app',
  familyId: 'family-001',
  createdAt: '2024-01-15T10:00:00Z',
};

// ─── Family Members ───────────────────────────────────────────────
export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'member-001',
    name: 'Tirth Patel',
    relationship: 'Self',
    dateOfBirth: '2002-11-14',
    gender: 'Male',
    bloodGroup: 'B+',
    avatarInitials: 'TP',
    avatarColor: '#B86F52',
    allergies: ['Penicillin'],
    conditions: [],
    emergencyContact: '+91 98765 43210',
    emergencyContactName: 'Rajesh Patel (Father)',
    activeMedicineCount: 1,
    medicalRecordCount: 4,
  },
  {
    id: 'member-002',
    name: 'Meena Patel',
    relationship: 'Mother',
    dateOfBirth: '1972-03-22',
    gender: 'Female',
    bloodGroup: 'A+',
    avatarInitials: 'MP',
    avatarColor: '#7C9274',
    allergies: ['Sulfa drugs', 'Dust mites'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    emergencyContact: '+91 98765 43210',
    emergencyContactName: 'Rajesh Patel',
    activeMedicineCount: 3,
    medicalRecordCount: 12,
  },
  {
    id: 'member-003',
    name: 'Rajesh Patel',
    relationship: 'Father',
    dateOfBirth: '1968-07-08',
    gender: 'Male',
    bloodGroup: 'B+',
    avatarInitials: 'RP',
    avatarColor: '#6B4636',
    allergies: [],
    conditions: ['Hypothyroidism', 'Mild Arthritis'],
    emergencyContact: '+91 98765 43210',
    emergencyContactName: 'Meena Patel',
    activeMedicineCount: 2,
    medicalRecordCount: 8,
  },
  {
    id: 'member-004',
    name: 'Hirabhai Patel',
    relationship: 'Grandfather',
    dateOfBirth: '1945-01-30',
    gender: 'Male',
    bloodGroup: 'O+',
    avatarInitials: 'HP',
    avatarColor: '#927565',
    allergies: ['Aspirin'],
    conditions: ['Type 2 Diabetes', 'Coronary Artery Disease', 'Cataracts'],
    emergencyContact: '+91 98765 43210',
    emergencyContactName: 'Rajesh Patel (Son)',
    activeMedicineCount: 5,
    medicalRecordCount: 21,
  },
  {
    id: 'member-005',
    name: 'Priya Patel',
    relationship: 'Sister',
    dateOfBirth: '2005-06-18',
    gender: 'Female',
    bloodGroup: 'A+',
    avatarInitials: 'PP',
    avatarColor: '#C9A882',
    allergies: ['Shellfish'],
    conditions: [],
    emergencyContact: '+91 98765 43210',
    emergencyContactName: 'Meena Patel (Mother)',
    activeMedicineCount: 0,
    medicalRecordCount: 3,
  },
];

// ─── Family ───────────────────────────────────────────────────────
export const mockFamily: Family = {
  id: 'family-001',
  name: 'Patel Family',
  ownerId: 'user-001',
  members: mockFamilyMembers,
  createdAt: '2024-01-15T10:00:00Z',
};

// ─── Doctors ─────────────────────────────────────────────────────
export const mockDoctors: Doctor[] = [
  {
    id: 'doctor-001',
    name: 'Dr. Sunil Mehta',
    specialty: 'Diabetologist',
    hospital: 'Apollo Hospital, Ahmedabad',
    phone: '+91 79 6670 1234',
    familyMemberIds: ['member-002', 'member-004'],
  },
  {
    id: 'doctor-002',
    name: 'Dr. Anita Rao',
    specialty: 'Cardiologist',
    hospital: 'Sterling Hospital, Ahmedabad',
    phone: '+91 79 4001 5678',
    familyMemberIds: ['member-004'],
  },
  {
    id: 'doctor-003',
    name: 'Dr. Kavita Shah',
    specialty: 'General Physician',
    hospital: 'Shrey Hospital, Ahmedabad',
    phone: '+91 79 2755 9900',
    familyMemberIds: ['member-001', 'member-002', 'member-003', 'member-005'],
  },
  {
    id: 'doctor-004',
    name: 'Dr. Ramesh Joshi',
    specialty: 'Endocrinologist',
    hospital: 'Apollo Hospital, Ahmedabad',
    phone: '+91 79 6670 4321',
    familyMemberIds: ['member-003'],
  },
];

// ─── Medical Records ──────────────────────────────────────────────
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'record-001',
    familyMemberId: 'member-002',
    title: 'HbA1c Blood Test',
    type: 'Lab Report',
    date: '2024-09-10',
    doctorId: 'doctor-001',
    doctorName: 'Dr. Sunil Mehta',
    hospital: 'Apollo Hospital',
    summary: 'HbA1c at 7.2% — within target range. Continue current medication.',
  },
  {
    id: 'record-002',
    familyMemberId: 'member-004',
    title: 'Cardiac Stress Test',
    type: 'Lab Report',
    date: '2024-09-05',
    doctorId: 'doctor-002',
    doctorName: 'Dr. Anita Rao',
    hospital: 'Sterling Hospital',
    summary: 'Mild ST depression noted. Review in 3 months.',
  },
  {
    id: 'record-003',
    familyMemberId: 'member-001',
    title: 'Annual Health Checkup',
    type: 'Consultation',
    date: '2024-08-20',
    doctorId: 'doctor-003',
    doctorName: 'Dr. Kavita Shah',
    hospital: 'Shrey Hospital',
    summary: 'All vitals normal. Recommended increased hydration.',
  },
  {
    id: 'record-004',
    familyMemberId: 'member-003',
    title: 'Thyroid Panel (TSH, T3, T4)',
    type: 'Lab Report',
    date: '2024-09-01',
    doctorId: 'doctor-004',
    doctorName: 'Dr. Ramesh Joshi',
    hospital: 'Apollo Hospital',
    summary: 'TSH slightly elevated at 5.1. Dose adjusted.',
  },
  {
    id: 'record-005',
    familyMemberId: 'member-002',
    title: 'Chest X-Ray',
    type: 'Imaging',
    date: '2024-07-15',
    doctorName: 'Dr. Kavita Shah',
    hospital: 'Shrey Hospital',
    summary: 'No abnormalities found.',
  },
  {
    id: 'record-006',
    familyMemberId: 'member-004',
    title: 'Ophthalmology Checkup',
    type: 'Consultation',
    date: '2024-08-28',
    doctorName: 'Dr. Preet Bhatia',
    hospital: 'Centre for Sight, Ahmedabad',
    summary: 'Cataract progression in left eye. Surgery in 6 months.',
  },
];

// ─── Medicines ────────────────────────────────────────────────────
export const mockMedicines: Medicine[] = [
  // Mom
  {
    id: 'med-001',
    familyMemberId: 'member-002',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    timing: 'After meal',
    startDate: '2022-04-01',
    isActive: true,
    purpose: 'Type 2 Diabetes',
  },
  {
    id: 'med-002',
    familyMemberId: 'member-002',
    name: 'Amlodipine',
    dosage: '5mg',
    frequency: 'Once daily',
    timing: 'Before meal',
    startDate: '2023-01-10',
    isActive: true,
    purpose: 'Hypertension',
  },
  {
    id: 'med-003',
    familyMemberId: 'member-002',
    name: 'Vitamin D3',
    dosage: '60000 IU',
    frequency: 'Weekly',
    timing: 'After meal',
    startDate: '2024-06-01',
    isActive: true,
    purpose: 'Vitamin D deficiency',
  },
  // Dad
  {
    id: 'med-004',
    familyMemberId: 'member-003',
    name: 'Levothyroxine',
    dosage: '50mcg',
    frequency: 'Once daily',
    timing: 'Before meal',
    startDate: '2021-08-15',
    isActive: true,
    purpose: 'Hypothyroidism',
  },
  {
    id: 'med-005',
    familyMemberId: 'member-003',
    name: 'Diclofenac Gel',
    dosage: '1% topical',
    frequency: 'Twice daily',
    timing: 'Anytime',
    startDate: '2024-03-01',
    isActive: true,
    purpose: 'Arthritis pain relief',
  },
  // Grandfather
  {
    id: 'med-006',
    familyMemberId: 'member-004',
    name: 'Metformin',
    dosage: '1000mg',
    frequency: 'Twice daily',
    timing: 'After meal',
    startDate: '2018-06-01',
    isActive: true,
    purpose: 'Type 2 Diabetes',
  },
  {
    id: 'med-007',
    familyMemberId: 'member-004',
    name: 'Rosuvastatin',
    dosage: '10mg',
    frequency: 'Once daily',
    timing: 'After meal',
    startDate: '2019-02-01',
    isActive: true,
    purpose: 'Cholesterol management',
  },
  {
    id: 'med-008',
    familyMemberId: 'member-004',
    name: 'Carvedilol',
    dosage: '6.25mg',
    frequency: 'Twice daily',
    timing: 'With meal',
    startDate: '2020-09-15',
    isActive: true,
    purpose: 'Coronary Artery Disease',
  },
  {
    id: 'med-009',
    familyMemberId: 'member-004',
    name: 'Ramipril',
    dosage: '5mg',
    frequency: 'Once daily',
    timing: 'Before meal',
    startDate: '2020-09-15',
    isActive: true,
    purpose: 'Heart protection',
  },
  {
    id: 'med-010',
    familyMemberId: 'member-004',
    name: 'Pantoprazole',
    dosage: '40mg',
    frequency: 'Once daily',
    timing: 'Before meal',
    startDate: '2023-11-01',
    isActive: true,
    purpose: 'Gastric protection',
  },
  // Tirth
  {
    id: 'med-011',
    familyMemberId: 'member-001',
    name: 'Cetirizine',
    dosage: '10mg',
    frequency: 'Once daily',
    timing: 'After meal',
    startDate: '2024-08-01',
    endDate: '2024-10-31',
    isActive: true,
    purpose: 'Seasonal allergies',
  },
];

// ─── Vaccinations ────────────────────────────────────────────────
export const mockVaccinations: Vaccination[] = [
  {
    id: 'vacc-001',
    familyMemberId: 'member-001',
    name: 'COVID-19 (Covishield) - Dose 2',
    dateAdministered: '2021-07-20',
    hospital: 'AMC Vaccination Centre',
  },
  {
    id: 'vacc-002',
    familyMemberId: 'member-001',
    name: 'COVID-19 Booster',
    dateAdministered: '2022-04-10',
    hospital: 'Shrey Hospital',
  },
  {
    id: 'vacc-003',
    familyMemberId: 'member-002',
    name: 'Influenza (Flu) Shot',
    dateAdministered: '2024-07-01',
    nextDueDate: '2025-07-01',
    hospital: 'Shrey Hospital',
  },
  {
    id: 'vacc-004',
    familyMemberId: 'member-004',
    name: 'Pneumococcal (PCV23)',
    dateAdministered: '2023-01-15',
    nextDueDate: '2028-01-15',
    hospital: 'Apollo Hospital',
  },
];

// ─── Appointments ─────────────────────────────────────────────────
export const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    familyMemberId: 'member-002',
    doctorId: 'doctor-001',
    doctorName: 'Dr. Sunil Mehta',
    specialty: 'Diabetologist',
    hospital: 'Apollo Hospital',
    dateTime: '2024-09-25T10:30:00',
    status: 'Upcoming',
    notes: 'Follow-up for HbA1c results',
  },
  {
    id: 'apt-002',
    familyMemberId: 'member-004',
    doctorId: 'doctor-002',
    doctorName: 'Dr. Anita Rao',
    specialty: 'Cardiologist',
    hospital: 'Sterling Hospital',
    dateTime: '2024-09-28T09:00:00',
    status: 'Upcoming',
    notes: 'Cardiac review, 3-month follow-up',
  },
  {
    id: 'apt-003',
    familyMemberId: 'member-003',
    doctorId: 'doctor-004',
    doctorName: 'Dr. Ramesh Joshi',
    specialty: 'Endocrinologist',
    hospital: 'Apollo Hospital',
    dateTime: '2024-10-02T11:00:00',
    status: 'Upcoming',
    notes: 'Thyroid dose review',
  },
  {
    id: 'apt-004',
    familyMemberId: 'member-001',
    doctorId: 'doctor-003',
    doctorName: 'Dr. Kavita Shah',
    specialty: 'General Physician',
    hospital: 'Shrey Hospital',
    dateTime: '2024-10-10T14:00:00',
    status: 'Upcoming',
    notes: 'Regular checkup',
  },
];

// ─── Helper: Get member by ID ─────────────────────────────────────
export function getMemberById(id: string): FamilyMember | undefined {
  return mockFamilyMembers.find(m => m.id === id);
}

// ─── Helper: Get records for a member ─────────────────────────────
export function getRecordsForMember(memberId: string): MedicalRecord[] {
  return mockMedicalRecords.filter(r => r.familyMemberId === memberId);
}

// ─── Helper: Get medicines for a member ──────────────────────────
export function getMedicinesForMember(memberId: string): Medicine[] {
  return mockMedicines.filter(m => m.familyMemberId === memberId && m.isActive);
}

// ─── Helper: Get upcoming appointments ───────────────────────────
export function getUpcomingAppointments(): Appointment[] {
  return mockAppointments.filter(a => a.status === 'Upcoming');
}

// ─── Dashboard Stats ──────────────────────────────────────────────
export const dashboardStats = {
  totalMembers: mockFamilyMembers.length,
  activeMedicines: mockMedicines.filter(m => m.isActive).length,
  totalRecords: mockMedicalRecords.length,
  upcomingAppointments: mockAppointments.filter(a => a.status === 'Upcoming').length,
};
