import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useDB } from './store';
import type { FamilyMember } from '../types';

/**
 * Which family member the health modules are showing.
 *
 * ponytail: local component state. When Person 1's family module lands, point
 * this provider at their selection instead — consumers only read the hook.
 */
const MemberContext = createContext<{
  member: FamilyMember | undefined;
  members: FamilyMember[];
  setMemberId: (id: string) => void;
} | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const { members } = useDB();
  const [id, setMemberId] = useState(members[0]?.id ?? '');
  const member = members.find((m) => m.id === id) ?? members[0];
  return (
    <MemberContext.Provider value={{ member, members, setMemberId }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember must be used inside <MemberProvider>');
  return ctx;
}

/** Initials for the avatar chips — no photo uploads needed to look complete. */
export function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}
