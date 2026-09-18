import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type {
  MedicalRecord,
  FamilyMember,
  Doctor,
  MedicalTimelineEvent,
  RecordFilters,
} from '@/types';
import { useDB, saveRecord as storeSaveRecord, deleteRecord as storeDeleteRecord } from '@/lib/store';

interface MedicalContextValue {
  // Data
  records: MedicalRecord[];
  familyMembers: FamilyMember[];
  doctors: Doctor[];
  timeline: MedicalTimelineEvent[];
  isNeonConnected: boolean;

  // Actions
  addRecord: (record: MedicalRecord) => Promise<void>;
  updateRecord: (id: string, updates: Partial<MedicalRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;

  // Helpers
  getRecordById: (id: string) => MedicalRecord | undefined;
  getFamilyMemberById: (id: string) => FamilyMember | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
  getRecordsForMember: (memberId: string) => MedicalRecord[];

  // Filter state
  filters: RecordFilters;
  setFilters: React.Dispatch<React.SetStateAction<RecordFilters>>;
  filteredRecords: MedicalRecord[];
}

const defaultFilters: RecordFilters = {
  searchQuery: '',
  familyMemberId: 'all',
  documentType: 'all',
  doctorId: 'all',
  dateFrom: '',
  dateTo: '',
};

const MedicalContext = createContext<MedicalContextValue | null>(null);

export function MedicalProvider({ children }: { children: React.ReactNode }) {
  const db = useDB();
  const [filters, setFilters] = useState<RecordFilters>(defaultFilters);
  const [isNeonConnected, setIsNeonConnected] = useState(false);

  // Sync with Neon SQL on initial load
  useEffect(() => {
    let active = true;
    async function syncFromNeon() {
      try {
        const res = await fetch('/api/records');
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (data.configured) {
          setIsNeonConnected(true);
        }
        if (Array.isArray(data.records) && data.records.length > 0) {
          data.records.forEach((rec: MedicalRecord) => {
            storeSaveRecord(rec);
          });
        }
      } catch {
        // Local offline / demo fallback
      }
    }
    syncFromNeon();
    return () => {
      active = false;
    };
  }, []);

  const addRecord = useCallback(async (record: MedicalRecord) => {
    // 1. Immediate optimistic reactive store update
    storeSaveRecord(record);

    // 2. Persist to Neon SQL backend
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        setIsNeonConnected(true);
      }
    } catch (err) {
      console.warn('[MedicalContext] Neon SQL sync deferred:', err);
    }
  }, []);

  const updateRecord = useCallback(async (id: string, updates: Partial<MedicalRecord>) => {
    const existing = db.records.find(r => r.id === id);
    if (existing) {
      const merged = { ...existing, ...updates };
      storeSaveRecord(merged);
      try {
        await fetch('/api/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merged),
        });
      } catch (err) {
        console.warn('[MedicalContext] Update Neon SQL sync deferred:', err);
      }
    }
  }, [db.records]);

  const deleteRecord = useCallback(async (id: string) => {
    storeDeleteRecord(id);
    try {
      await fetch(`/api/records/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[MedicalContext] Delete Neon SQL sync deferred:', err);
    }
  }, []);

  const getRecordById = useCallback(
    (id: string) => db.records.find(r => r.id === id),
    [db.records]
  );

  const getFamilyMemberById = useCallback(
    (id: string) => db.members.find(m => m.id === id),
    [db.members]
  );

  const getDoctorById = useCallback(
    (id: string) => db.doctors.find(d => d.id === id),
    [db.doctors]
  );

  const getRecordsForMember = useCallback(
    (memberId: string) => db.records.filter(r => r.familyMemberId === memberId),
    [db.records]
  );

  // Generate timeline events from records and vaccinations
  const timeline = useMemo<MedicalTimelineEvent[]>(() => {
    const events: MedicalTimelineEvent[] = [];

    db.records.forEach(r => {
      events.push({
        id: `tl-rec-${r.id}`,
        familyMemberId: r.familyMemberId,
        date: r.date || (r as any).medicalDate || '',
        title: r.title,
        type: 'record',
        description: r.summary || r.notes || '',
        recordId: r.id,
      });
    });

    db.vaccinations.forEach(v => {
      events.push({
        id: `tl-vac-${v.id}`,
        familyMemberId: v.familyMemberId,
        date: v.dateAdministered || v.date || '',
        title: `Vaccine: ${v.name || v.vaccine || ''}`,
        type: 'vaccination',
        description: v.notes || v.dose || '',
      });
    });

    return events.sort((a, b) => (b.date > a.date ? 1 : -1));
  }, [db.records, db.vaccinations]);

  // Client-side filtering logic across records
  const filteredRecords = useMemo(() => {
    return db.records.filter(record => {
      // Search query filter
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = record.title.toLowerCase().includes(q);
        const matchesDoctor = record.doctorName?.toLowerCase().includes(q);
        const matchesHospital = record.hospital?.toLowerCase().includes(q);
        const matchesNotes = record.notes?.toLowerCase().includes(q);
        const matchesTags = record.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDoctor && !matchesHospital && !matchesNotes && !matchesTags) {
          return false;
        }
      }

      // Family member filter
      if (filters.familyMemberId && filters.familyMemberId !== 'all') {
        if (record.familyMemberId !== filters.familyMemberId) return false;
      }

      // Document type filter
      if (filters.documentType && filters.documentType !== 'all') {
        const typeStr = String(record.type || (record as any).documentType || '');
        if (typeStr.toLowerCase() !== filters.documentType.toLowerCase()) return false;
      }

      // Doctor filter
      if (filters.doctorId && filters.doctorId !== 'all') {
        if (record.doctorId !== filters.doctorId) return false;
      }

      // Date range filter
      const recordDate = record.date || (record as any).medicalDate || '';
      if (filters.dateFrom && recordDate < filters.dateFrom) return false;
      if (filters.dateTo && recordDate > filters.dateTo) return false;

      return true;
    });
  }, [db.records, filters]);

  return (
    <MedicalContext.Provider
      value={{
        records: db.records,
        familyMembers: db.members,
        doctors: db.doctors,
        timeline,
        isNeonConnected,
        addRecord,
        updateRecord,
        deleteRecord,
        getRecordById,
        getFamilyMemberById,
        getDoctorById,
        getRecordsForMember,
        filters,
        setFilters,
        filteredRecords,
      }}
    >
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedical(): MedicalContextValue {
  const ctx = useContext(MedicalContext);
  if (!ctx) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return ctx;
}
