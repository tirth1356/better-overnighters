import { useMedical } from '@/context/MedicalContext';
import { Input, Select } from '@/components/ui/Input';
import { X, SlidersHorizontal } from 'lucide-react';
import type { RecordFilters as RecordFiltersType } from '@/types';

const DOC_TYPE_OPTIONS = [
  { value: 'all', label: 'All Document Types' },
  { value: 'Lab Report', label: 'Lab Reports' },
  { value: 'Prescription', label: 'Prescriptions' },
  { value: 'Imaging', label: 'Imaging / Scans' },
  { value: 'Consultation', label: 'Consultations' },
  { value: 'Discharge Summary', label: 'Discharge Summaries' },
  { value: 'Vaccination', label: 'Vaccinations' },
  { value: 'Other', label: 'Other' },
];

export function RecordFilters() {
  const { filters, setFilters, familyMembers, doctors } = useMedical();

  const memberOptions = [
    { value: 'all', label: 'All Family Members' },
    ...familyMembers.map(m => ({ value: m.id, label: m.name })),
  ];

  const doctorOptions = [
    { value: 'all', label: 'All Doctors' },
    ...doctors.map(d => ({ value: d.id, label: d.name })),
  ];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.familyMemberId !== 'all' ||
    filters.documentType !== 'all' ||
    filters.doctorId !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  const clearFilters = () =>
    setFilters({
      searchQuery: '',
      familyMemberId: 'all',
      documentType: 'all',
      doctorId: 'all',
      dateFrom: '',
      dateTo: '',
    });

  return (
    <section className="bg-white/80 border border-[#E8DDD0] rounded-2xl p-4 space-y-3 shadow-sm" aria-label="Filter records">
      {/* Row 1: Search */}
      <Input
        isSearch
        placeholder="Search by report name, doctor, hospital, conditions or tags…"
        value={filters.searchQuery}
        onChange={e =>
          setFilters((prev: RecordFiltersType) => ({ ...prev, searchQuery: e.target.value }))
        }
        aria-label="Search records"
      />

      {/* Row 2: Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Select
          options={memberOptions}
          value={filters.familyMemberId}
          onChange={e =>
            setFilters((prev: RecordFiltersType) => ({ ...prev, familyMemberId: e.target.value }))
          }
          aria-label="Filter by family member"
        />
        <Select
          options={DOC_TYPE_OPTIONS}
          value={filters.documentType}
          onChange={e =>
            setFilters((prev: RecordFiltersType) => ({
              ...prev,
              documentType: e.target.value,
            }))
          }
          aria-label="Filter by document type"
        />
        <Select
          options={doctorOptions}
          value={filters.doctorId}
          onChange={e =>
            setFilters((prev: RecordFiltersType) => ({ ...prev, doctorId: e.target.value }))
          }
          aria-label="Filter by doctor"
        />
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-warm-muted flex items-center gap-1 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
            Filtered results active
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-terra font-semibold hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Reset all filters
          </button>
        </div>
      )}
    </section>
  );
}

export default RecordFilters;
