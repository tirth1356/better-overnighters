'use client'

/**
 * Medical Context
 * ===============
 * Provides medical records, family members, doctors, and timeline
 * to the entire (medical) layout subtree.
 *
 * Person 1 integration:
 *   - Replace mockFamilyMembers with data from your auth/family context
 *   - Replace currentUser stub with your actual authenticated user
 *   - This context reads from Person 1's data automatically once they
 *     provide a useFamilyMembers() hook or similar.
 */

import React, { createContext, useContext, useState, useCallback } from 'react'
import type {
  MedicalRecord,
  FamilyMember,
  Doctor,
  MedicalTimelineEvent,
  RecordFilters,
} from '@/types'
import { mockMedicalRecords } from '@/data/mockMedicalRecords'
import { mockFamilyMembers } from '@/data/mockFamilyMembers'
import { mockDoctors } from '@/data/mockDoctors'
import { mockTimeline } from '@/data/mockTimeline'

interface MedicalContextValue {
  // Data
  records: MedicalRecord[]
  familyMembers: FamilyMember[]
  doctors: Doctor[]
  timeline: MedicalTimelineEvent[]

  // Actions
  addRecord: (record: MedicalRecord) => void
  updateRecord: (id: string, updates: Partial<MedicalRecord>) => void
  deleteRecord: (id: string) => void

  // Helpers
  getRecordById: (id: string) => MedicalRecord | undefined
  getFamilyMemberById: (id: string) => FamilyMember | undefined
  getDoctorById: (id: string) => Doctor | undefined
  getRecordsForMember: (memberId: string) => MedicalRecord[]

  // Filter state
  filters: RecordFilters
  setFilters: React.Dispatch<React.SetStateAction<RecordFilters>>
  filteredRecords: MedicalRecord[]
}

const defaultFilters: RecordFilters = {
  searchQuery: '',
  familyMemberId: 'all',
  documentType: 'all',
  doctorId: 'all',
  dateFrom: '',
  dateTo: '',
}

const MedicalContext = createContext<MedicalContextValue | null>(null)

export function MedicalProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<MedicalRecord[]>(mockMedicalRecords)
  const [filters, setFilters] = useState<RecordFilters>(defaultFilters)

  const addRecord = useCallback((record: MedicalRecord) => {
    setRecords(prev => [record, ...prev])
  }, [])

  const updateRecord = useCallback((id: string, updates: Partial<MedicalRecord>) => {
    setRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    )
  }, [])

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id))
  }, [])

  const getRecordById = useCallback(
    (id: string) => records.find(r => r.id === id),
    [records]
  )

  const getFamilyMemberById = useCallback(
    (id: string) => mockFamilyMembers.find(m => m.id === id),
    []
  )

  const getDoctorById = useCallback(
    (id: string) => mockDoctors.find(d => d.id === id),
    []
  )

  const getRecordsForMember = useCallback(
    (memberId: string) => records.filter(r => r.familyMemberId === memberId),
    [records]
  )

  const filteredRecords = records.filter(record => {
    const q = filters.searchQuery.toLowerCase()
    if (q && !record.title.toLowerCase().includes(q) &&
        !record.hospital?.toLowerCase().includes(q) &&
        !record.tags.some(t => t.toLowerCase().includes(q))) {
      return false
    }
    if (filters.familyMemberId !== 'all' && record.familyMemberId !== filters.familyMemberId) {
      return false
    }
    if (filters.documentType !== 'all' && record.documentType !== filters.documentType) {
      return false
    }
    if (filters.doctorId !== 'all' && record.doctorId !== filters.doctorId) {
      return false
    }
    if (filters.dateFrom && record.medicalDate < filters.dateFrom) return false
    if (filters.dateTo && record.medicalDate > filters.dateTo) return false
    return true
  })

  return (
    <MedicalContext.Provider
      value={{
        records,
        familyMembers: mockFamilyMembers,
        doctors: mockDoctors,
        timeline: mockTimeline,
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
  )
}

export function useMedical() {
  const ctx = useContext(MedicalContext)
  if (!ctx) throw new Error('useMedical must be used inside MedicalProvider')
  return ctx
}
