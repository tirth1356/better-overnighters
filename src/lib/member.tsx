import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDB } from './store';
import type { FamilyMember } from '../types';

/**
 * Which family member the health modules are showing.
 * Provides active member state, member list, and switcher across all modules.
 */
const MemberContext = createContext<{
  member: FamilyMember | undefined;
  members: FamilyMember[];
  setMemberId: (id: string) => void;
} | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const { members } = useDB();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pick initial ID from URL search param if present, or first member
  const paramId = searchParams.get('member');
  const [id, setIdState] = useState<string>(
    paramId && members.some(m => m.id === paramId)
      ? paramId
      : members[0]?.id ?? ''
  );

  // Sync state if URL search param changes
  useEffect(() => {
    const urlMember = searchParams.get('member');
    if (urlMember && members.some(m => m.id === urlMember)) {
      setIdState(urlMember);
    }
  }, [searchParams, members]);

  // Fallback if current id no longer exists in members
  const member = members.find((m) => m.id === id) ?? members[0];

  const setMemberId = (newId: string) => {
    setIdState(newId);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('member', newId);
      return next;
    }, { replace: true });
  };

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

/** Initials for the avatar chips */
export function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}
