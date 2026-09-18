// @ts-nocheck
import type { Doctor, EmergencyCard, FamilyMember } from '../../types';

/**
 * Flat, self-contained snapshot of an emergency card.
 *
 * Kept separate from the UI so a QR code (or a public read-only route) can be
 * generated from exactly this object later — encode it, don't re-derive it.
 */
export interface EmergencyPayload {
  version: 1;
  name: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: { name: string; phone: string };
  primaryDoctor: { name: string; phone: string; specialization: string } | null;
  notes: string;
}

export function emergencyPayload(
  member: FamilyMember,
  card: EmergencyCard | undefined,
  doctor: Doctor | undefined,
): EmergencyPayload {
  return {
    version: 1,
    name: member.name,
    bloodGroup: card?.bloodGroup || member.bloodGroup || 'Not recorded',
    allergies: card?.allergies ?? [],
    conditions: card?.conditions ?? [],
    emergencyContact: {
      name: card?.emergencyContactName ?? '',
      phone: card?.emergencyContactPhone ?? '',
    },
    primaryDoctor: doctor
      ? { name: doctor.name, phone: doctor.phone ?? '', specialization: doctor.specialization }
      : null,
    notes: card?.notes ?? '',
  };
}

