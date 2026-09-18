import { useSyncExternalStore } from 'react';
import type {
  Doctor, DoseLog, EmergencyCard, FamilyMember, MedicalRecordRef, Medicine, Vaccination,
} from '../types';
import { seed } from './seed';

/**
 * Local persistence for the medicine/doctor/vaccination/emergency modules.
 *
 * ponytail: localStorage is the whole backend for these modules. Swap the
 * `read`/`write` pair for API calls when Person 1's server-side data layer
 * lands — nothing outside this file touches storage.
 */
export interface DB {
  members: FamilyMember[];
  medicines: Medicine[];
  doses: DoseLog[];
  doctors: Doctor[];
  vaccinations: Vaccination[];
  emergency: EmergencyCard[];
  records: MedicalRecordRef[];
}

const KEY = 'better-overnighters.health.v1';

function read(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...seed(), ...(JSON.parse(raw) as Partial<DB>) } as DB;
  } catch {
    /* corrupted or unavailable storage falls through to seed data */
  }
  return seed();
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

export const newId = () => Math.random().toString(36).slice(2, 10);

/* ---- collection helpers (thin, on purpose) ---- */

type Keyed = { id: string };

function upsert<T extends Keyed>(list: T[], item: T): T[] {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [...list, item];
  const next = list.slice();
  next[i] = item;
  return next;
}

export const saveMedicine = (m: Medicine) => update((d) => ({ medicines: upsert(d.medicines, m) }));
export const deleteMedicine = (id: string) =>
  update((d) => ({
    medicines: d.medicines.filter((m) => m.id !== id),
    doses: d.doses.filter((x) => x.medicineId !== id),
  }));

export const saveDoctor = (doc: Doctor) => update((d) => ({ doctors: upsert(d.doctors, doc) }));
export const deleteDoctor = (id: string) => update((d) => ({ doctors: d.doctors.filter((x) => x.id !== id) }));

export const saveVaccination = (v: Vaccination) =>
  update((d) => ({ vaccinations: upsert(d.vaccinations, v) }));
export const deleteVaccination = (id: string) =>
  update((d) => ({ vaccinations: d.vaccinations.filter((x) => x.id !== id) }));

export const saveEmergencyCard = (card: EmergencyCard) =>
  update((d) => ({
    emergency: [...d.emergency.filter((c) => c.familyMemberId !== card.familyMemberId), card],
  }));

/** Records a dose outcome; re-recording the same slot overwrites it. */
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
        { id: newId(), medicineId, date, time, status, recordedAt: new Date().toISOString() },
      ],
    };
  });
}
