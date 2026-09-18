import { useState } from 'react';
import { Users, GitFork } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FamilyMember } from '@/types';
import { mockFamilyMembers } from '@/data/mockData';
import FamilyGrid from '@/components/family/FamilyGrid';

let nextId = 100;

export default function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>(mockFamilyMembers);

  function handleAdd(data: Omit<FamilyMember, 'id'>) {
    const newMember: FamilyMember = { ...data, id: `member-${++nextId}` };
    setMembers(prev => [...prev, newMember]);
  }

  function handleEdit(id: string, data: Omit<FamilyMember, 'id'>) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  }

  function handleDelete(id: string) {
    if (window.confirm('Remove this family member? This action cannot be undone.')) {
      setMembers(prev => prev.filter(m => m.id !== id));
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
