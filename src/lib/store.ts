import { useSyncExternalStore } from 'react';
import type {
  Doctor,
  DoseLog,
  EmergencyCard,
  FamilyMember,
  MedicalRecord,
  Medicine,
  Vaccination,
  Appointment,
} from '../types';
import { seed } from './seed';

/**
 * Local reactive persistence for all FamilyCare modules.
 * Single source of truth shared across:
 * - Dashboard
 * - Family Members
 * - Family Tree
 * - Medical Records / Vault
 * - Medicines & Adherence
 * - Doctors
 * - Vaccinations
 * - Emergency Cards
 */
export interface DB {
  members: FamilyMember[];
  medicines: Medicine[];
  doses: DoseLog[];
  doctors: Doctor[];
  vaccinations: Vaccination[];
  emergency: EmergencyCard[];
  records: MedicalRecord[];
  appointments: Appointment[];
}

const KEY = 'better-overnighters.health.v2';

function read(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DB>;
      const initial = seed();
      return {
        members: parsed.members ?? initial.members,
        medicines: parsed.medicines ?? initial.medicines,
        doses: parsed.doses ?? initial.doses,
        doctors: parsed.doctors ?? initial.doctors,
        vaccinations: parsed.vaccinations ?? initial.vaccinations,
        emergency: parsed.emergency ?? initial.emergency,
        records: parsed.records ?? initial.records,
        appointments: parsed.appointments ?? initial.appointments ?? [],
      };
    }
  } catch {
    /* corrupted or unavailable storage falls through to seed data */
  }
  const initial = seed();
  return {
    ...initial,
    appointments: initial.appointments ?? [],
  };
}

let db: DB = read();
const listeners = new Set<() => void>();

function write(next: DB) {
  db = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota — keep working in memory for this session */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDB(): DB {
  return useSyncExternalStore(subscribe, () => db, () => db);
}

export function getDB(): DB {
  return db;
}

export function update(patch: (current: DB) => Partial<DB>) {
  write({ ...db, ...patch(db) });
}

export const newId = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

/* ---- collection helpers ---- */

type Keyed = { id: string };

function upsert<T extends Keyed>(list: T[], item: T): T[] {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [...list, item];
  const next = list.slice();
  next[i] = item;
  return next;
}

// ── Family Members ────────────────────────────────────────────────
export const saveMember = (m: FamilyMember) => update((d) => ({ members: upsert(d.members, m) }));
export const deleteMember = (id: string) =>
  update((d) => ({
    members: d.members.filter((m) => m.id !== id),
    medicines: d.medicines.filter((med) => med.familyMemberId !== id),
    records: d.records.filter((rec) => rec.familyMemberId !== id),
    vaccinations: d.vaccinations.filter((v) => v.familyMemberId !== id),
    emergency: d.emergency.filter((e) => e.familyMemberId !== id),
    appointments: d.appointments.filter((a) => a.familyMemberId !== id),
  }));

// ── Medicines ─────────────────────────────────────────────────────
export const saveMedicine = (m: Medicine) => update((d) => ({ medicines: upsert(d.medicines, m) }));
export const deleteMedicine = (id: string) =>
  update((d) => ({
    medicines: d.medicines.filter((m) => m.id !== id),
    doses: d.doses.filter((x) => x.medicineId !== id),
  }));

// ── Doctors ───────────────────────────────────────────────────────
export const saveDoctor = (doc: Doctor) => update((d) => ({ doctors: upsert(d.doctors, doc) }));
export const deleteDoctor = (id: string) =>
  update((d) => ({ doctors: d.doctors.filter((x) => x.id !== id) }));

// ── Vaccinations ──────────────────────────────────────────────────
export const saveVaccination = (v: Vaccination) =>
  update((d) => ({ vaccinations: upsert(d.vaccinations, v) }));
export const deleteVaccination = (id: string) =>
  update((d) => ({ vaccinations: d.vaccinations.filter((x) => x.id !== id) }));

// ── Emergency Cards ───────────────────────────────────────────────
export const saveEmergencyCard = (card: EmergencyCard) =>
  update((d) => ({
    emergency: [...d.emergency.filter((c) => c.familyMemberId !== card.familyMemberId), card],
  }));

// ── Medical Records ───────────────────────────────────────────────
export const saveRecord = (rec: MedicalRecord) => update((d) => ({ records: upsert(d.records, rec) }));
export const deleteRecord = (id: string) =>
  update((d) => ({ records: d.records.filter((r) => r.id !== id) }));

// ── Appointments ──────────────────────────────────────────────────
export const saveAppointment = (apt: Appointment) =>
  update((d) => ({ appointments: upsert(d.appointments, apt) }));
export const deleteAppointment = (id: string) =>
  update((d) => ({ appointments: d.appointments.filter((a) => a.id !== id) }));

// ── Doses ─────────────────────────────────────────────────────────
export function setDoseStatus(
  medicineId: string,
  date: string,
  time: string,
  status: DoseLog['status'] | 'pending',
) {
  update((d) => {
    const rest = d.doses.filter(
      (x) => !(x.medicineId === medicineId && x.date === date && x.time === time),
    );
    if (status === 'pending') return { doses: rest };
    return {
      doses: [
        ...rest,
        { id: newId('dl'), medicineId, date, time, status, recordedAt: new Date().toISOString() },
      ],
    };
  });
}

// ── Reset to fresh demo data ──────────────────────────────────────
export function resetDB() {
  const fresh = seed();
  write({
    ...fresh,
    appointments: fresh.appointments ?? [],
  });
}
