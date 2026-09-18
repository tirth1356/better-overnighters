import { Users, GitFork } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FamilyMember } from '@/types';
import { useDB, saveMember, deleteMember, newId } from '@/lib/store';
import FamilyGrid from '@/components/family/FamilyGrid';

export default function FamilyPage() {
  const db = useDB();

  // Enrich members with real-time counts from live store
  const members: FamilyMember[] = db.members.map(m => ({
    ...m,
    activeMedicineCount: db.medicines.filter(med => med.familyMemberId === m.id && med.isActive).length,
    medicalRecordCount: db.records.filter(r => r.familyMemberId === m.id).length,
  }));

  function handleAdd(data: Omit<FamilyMember, 'id'>) {
    const memberId = newId('member');
    const newMember: FamilyMember = {
      ...data,
      id: memberId,
      relation: data.relationship,
      activeMedicineCount: 0,
      medicalRecordCount: 0,
    };
    saveMember(newMember);
  }

  function handleEdit(id: string, data: Omit<FamilyMember, 'id'>) {
    const existing = db.members.find(m => m.id === id);
    if (!existing) return;
    const updated: FamilyMember = {
      ...existing,
      ...data,
      relation: data.relationship,
    };
    saveMember(updated);
  }

  function handleDelete(id: string) {
    if (window.confirm('Remove this family member? All associated health records, medicines, and appointments will also be cleaned up.')) {
      deleteMember(id);
    }
  }

  return (
    <div className="family-page animate-fade-up">
      {/* Page header */}
      <div className="page-header">
        <div>
          <div className="page-header-eyebrow">
            <Users size={16} />
            <span>Patel Family</span>
          </div>
          <h1 className="page-title">Family Members</h1>
          <p className="page-subtitle">
            {members.length} member{members.length !== 1 ? 's' : ''} · Manage health profiles for your entire family
          </p>
        </div>
        <Link
          to="/family-tree"
          className="btn btn-outline btn-md"
          id="view-family-tree-btn"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <GitFork size={15} />
          View Family Tree
        </Link>
      </div>

      <FamilyGrid
        members={members}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <style>{pageStyles}</style>
    </div>
  );
}

const pageStyles = `
  .family-page {
    max-width: 1200px;
  }

  .page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .page-header-eyebrow {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-terra);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.375rem;
  }

  .page-title {
    font-family: var(--font-serif);
    font-size: 2rem;
    color: var(--color-text);
    margin: 0;
  }

  .page-subtitle {
    font-size: 0.9375rem;
    color: var(--color-text-muted);
    margin-top: 0.25rem;
  }
`;
