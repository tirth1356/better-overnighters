import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { FamilyMember } from '@/types';
import FamilyMemberCard from './FamilyMemberCard';
import AddMemberModal from './AddMemberModal';

interface FamilyGridProps {
  members:   FamilyMember[];
  onAdd:     (member: Omit<FamilyMember, 'id'>) => void;
  onEdit:    (id: string, member: Omit<FamilyMember, 'id'>) => void;
  onDelete:  (id: string) => void;
}

export default function FamilyGrid({ members, onAdd, onEdit, onDelete }: FamilyGridProps) {
  const [showAdd, setShowAdd]     = useState(false);
  const [editing, setEditing]     = useState<FamilyMember | null>(null);

  function handleSave(data: Omit<FamilyMember, 'id'>) {
    if (editing) {
      onEdit(editing.id, data);
      setEditing(null);
    } else {
      onAdd(data);
      setShowAdd(false);
    }
  }

  return (
    <>
      <div className="family-grid">
        {members.map(m => (
          <FamilyMemberCard
            key={m.id}
            member={m}
            onEdit={member => { setEditing(member); }}
            onDelete={onDelete}
          />
        ))}

        {/* Add member card */}
        <button
          id="add-family-member-btn"
          className="add-member-card"
          onClick={() => setShowAdd(true)}
          aria-label="Add a family member"
        >
          <div className="add-member-icon">
            <UserPlus size={28} strokeWidth={1.5} />
          </div>
          <span className="add-member-text">Add family member</span>
          <span className="add-member-sub">Tap to add a new member</span>
        </button>
      </div>

      {(showAdd || editing) && (
        <AddMemberModal
          onClose={() => { setShowAdd(false); setEditing(null); }}
          onSave={handleSave}
          existing={editing ?? undefined}
        />
      )}

      <style>{gridStyles}</style>
    </>
  );
}

const gridStyles = `
  .family-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .add-member-card {
    background: transparent;
    border: 2px dashed var(--color-border-dark);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    cursor: pointer;
    transition: all var(--transition-base);
    min-height: 200px;
    color: var(--color-text-muted);
  }

  .add-member-card:hover {
    border-color: var(--color-terra);
    background: rgba(184,111,82,0.04);
    color: var(--color-terra);
  }

  .add-member-icon {
    width: 56px; height: 56px;
    border-radius: var(--radius-lg);
    background: var(--color-cream);
    display: flex; align-items: center; justify-content: center;
    color: inherit;
    transition: background var(--transition-fast);
  }

  .add-member-card:hover .add-member-icon {
    background: rgba(184,111,82,0.1);
  }

  .add-member-text {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .add-member-sub {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  @media (max-width: 640px) {
    .family-grid {
      grid-template-columns: 1fr;
    }
  }
`;
