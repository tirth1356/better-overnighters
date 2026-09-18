import { Plus, FolderOpen, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMedical } from '@/context/MedicalContext';
import { RecordCard } from './RecordCard';
import { RecordFilters } from './RecordFilters';
import { CategorySidebar } from './CategorySidebar';

export default function MedicalRecordsPage() {
  const { filteredRecords, getFamilyMemberById, getDoctorById, isNeonConnected } = useMedical();

  return (
    <div className="min-h-full space-y-6 animate-fade-up" style={{ maxWidth: '1200px' }}>
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-3xl font-serif text-espresso">Medical Records Vault</h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5 ${
                isNeonConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-[#F5EBE1] text-[#7A6250] border border-[#E8DDD0]'
              }`}
              title={isNeonConnected ? 'Reports synced with Neon PostgreSQL database' : 'Reports saved in local vault'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isNeonConnected ? 'bg-emerald-500 animate-pulse' : 'bg-[#9C826B]'
                }`}
              />
              {isNeonConnected ? 'Neon SQL Active' : 'Local Vault'}
            </span>
          </div>
          <p className="text-warm-muted text-sm mt-1">
            {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} preserved in your family digital health archive
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <Link
            to="/ai/explain"
            className="btn btn-outline btn-md"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Bot size={16} />
            Multilingual AI
          </Link>
          <Link
            to="/records/upload"
            className="btn btn-primary btn-md"
            id="upload-record-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} />
            Upload Document
          </Link>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Category Sidebar */}
        <aside className="lg:col-span-3">
          <CategorySidebar />
        </aside>

        {/* Right Content Stream */}
        <main className="lg:col-span-9 space-y-4">
          {/* Filters */}
          <RecordFilters />

          {/* Record Grid */}
          {filteredRecords.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              role="list"
              aria-label="Medical records"
            >
              {filteredRecords.map(record => (
                <div key={record.id} role="listitem">
                  <RecordCard
                    record={record}
                    member={getFamilyMemberById(record.familyMemberId)}
                    doctor={record.doctorId ? getDoctorById(record.doctorId) : undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-beige-100 flex items-center justify-center mb-4 text-terra">
        <FolderOpen size={32} />
      </div>
      <h3 className="text-lg font-semibold text-espresso mb-1">No medical records match</h3>
      <p className="text-warm-muted text-sm max-w-sm mb-6">
        No records match your selected category or search filters. Try resetting the filters or upload a new record.
      </p>
      <Link
        to="/records/upload"
        className="btn btn-primary btn-md"
        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <Plus size={16} />
        Upload First Record
      </Link>
    </div>
  );
}
