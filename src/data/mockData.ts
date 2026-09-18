// ─── Centralized Mock Data for FamilyCare ───
// Synchronized with src/lib/seed.ts and src/lib/store.ts

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
import { seed } from '@/lib/seed';
import { getDB } from '@/lib/store';

// ─── Mock User ────────────────────────────────────────────────────
export const mockUser: User = {
  id: 'user-001',
  name: 'Tirth Patel',
  email: 'tirth@familycare.app',
  familyId: 'family-001',
  createdAt: '2024-01-15T10:00:00Z',
};

const initial = seed();

// ─── Static initial exports (for fallback/SSR) ────────────────────
export const mockFamilyMembers: FamilyMember[] = initial.members;
export const mockDoctors: Doctor[] = initial.doctors;
export const mockMedicalRecords: MedicalRecord[] = initial.records;
export const mockMedicines: Medicine[] = initial.medicines;
export const mockVaccinations: Vaccination[] = initial.vaccinations;
export const mockAppointments: Appointment[] = initial.appointments ?? [];

// ─── Family ───────────────────────────────────────────────────────
export const mockFamily: Family = {
  id: 'family-001',
  name: 'Patel Family',
  ownerId: 'user-001',
  members: mockFamilyMembers,
  createdAt: '2024-01-15T10:00:00Z',
};

// ─── Reactive Helpers (Reads from live store if available) ─────────
export function getMemberById(id: string): FamilyMember | undefined {
  const db = getDB();
  return (db.members || initial.members).find(m => m.id === id);
}

export function getDoctorById(id: string): Doctor | undefined {
  const db = getDB();
  return (db.doctors || initial.doctors).find(d => d.id === id);
}

export function getRecordsForMember(memberId: string): MedicalRecord[] {
  const db = getDB();
  return (db.records || initial.records).filter(r => r.familyMemberId === memberId);
}

export function getMedicinesForMember(memberId: string): Medicine[] {
  const db = getDB();
  return (db.medicines || initial.medicines).filter(m => m.familyMemberId === memberId && m.isActive);
}

export function getUpcomingAppointments(): Appointment[] {
  const db = getDB();
  return (db.appointments || initial.appointments || []).filter(a => a.status === 'Upcoming');
}

// ─── Dashboard Stats helper ────────────────────────────────────────
export function getDashboardStats() {
  const db = getDB();
  const members = db.members || initial.members;
  const medicines = db.medicines || initial.medicines;
  const records = db.records || initial.records;
  const appointments = db.appointments || initial.appointments || [];

  return {
    totalMembers: members.length,
    activeMedicines: medicines.filter(m => m.isActive).length,
    totalRecords: records.length,
    upcomingAppointments: appointments.filter(a => a.status === 'Upcoming').length,
  };
}

export const dashboardStats = getDashboardStats();
