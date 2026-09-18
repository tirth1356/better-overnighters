import type { FamilyMember } from '@/types'

// ── Mock Family Members ────────────────────────────────────
// Created by Person 2 as placeholder.
// Person 1 will provide real family data from their auth/family system.
// Replace this import in context/MedicalContext.tsx with Person 1's hook.

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'fm-1',
    name: 'Ramesh Mehta',
    dateOfBirth: '1966-04-12',
    gender: 'male',
    relationship: 'self',
    bloodGroup: 'B+',
    allergies: ['Penicillin'],
    chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
    primaryDoctorId: 'dr-1',
  },
  {
    id: 'fm-2',
    name: 'Sunita Mehta',
    dateOfBirth: '1971-09-03',
    gender: 'female',
    relationship: 'spouse',
    bloodGroup: 'O+',
    allergies: [],
    chronicConditions: ['Hypothyroidism'],
    primaryDoctorId: 'dr-2',
  },
  {
    id: 'fm-3',
    name: 'Arjun Mehta',
    dateOfBirth: '1994-07-22',
    gender: 'male',
    relationship: 'son',
    bloodGroup: 'B+',
    allergies: [],
    chronicConditions: [],
    primaryDoctorId: 'dr-2',
  },
  {
    id: 'fm-4',
    name: 'Priya Mehta',
    dateOfBirth: '1996-02-14',
    gender: 'female',
    relationship: 'daughter',
    bloodGroup: 'A+',
    allergies: ['Sulfa drugs'],
    chronicConditions: ['Mild Anemia'],
    primaryDoctorId: 'dr-3',
  },
  {
    id: 'fm-5',
    name: 'Aarav Mehta',
    dateOfBirth: '2020-11-05',
    gender: 'male',
    relationship: 'son',
    bloodGroup: 'O+',
    allergies: [],
    chronicConditions: [],
    primaryDoctorId: 'dr-3',
  },
]
