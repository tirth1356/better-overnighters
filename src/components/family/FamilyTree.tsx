import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FamilyMember } from '@/types';
import { useDB } from '@/lib/store';
import Avatar from '@/components/ui/Avatar';
import { BloodBadge } from '@/components/ui/Badge';
import { calcAge } from '@/utils';
import { X, Pill, FileText, Phone, ArrowRight, AlertTriangle } from 'lucide-react';

interface TreeNode {
  memberId: string;
  children?: TreeNode[];
}

const DEFAULT_TREE: TreeNode = {
  memberId: 'member-004', // Grandfather (Hirabhai)
  children: [
    {
      memberId: 'member-003', // Dad (Rajesh)
      children: [
        { memberId: 'member-001' }, // Tirth (Self)
        { memberId: 'member-005' }, // Sister (Priya)
      ],
    },
    {
      memberId: 'member-002', // Mom (Meena)
    },
  ],
};

function MemberDetail({
  member,
  activeMedicineCount,
  medicalRecordCount,
  onClose,
}: {
  member: FamilyMember;
  activeMedicineCount: number;
  medicalRecordCount: number;
  onClose: () => void;
}) {
  const age = calcAge(member.dateOfBirth);

  return (
    <div className="tree-detail animate-fade-up">
      <div className="tree-detail-header">
        <Avatar
          src={member.avatarUrl}
          initials={member.avatarInitials}
          name={member.name}
          size="xl"
          color={member.avatarColor}
        />
        <div className="tree-detail-info">
          <h3>{member.name}</h3>
          <p>{member.relationship || member.relation} · {age} years</p>
          <BloodBadge value={member.bloodGroup} />
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close details">
          <X size={16} />
        </button>
      </div>

      {member.conditions && member.conditions.length > 0 && (
        <div className="tree-detail-section">
          <p className="tree-detail-label">Conditions</p>
          <div className="tree-detail-tags">
            {member.conditions.map(c => (
              <span key={c} className="badge badge-terra">{c}</span>
            ))}
          </div>
        </div>
      )}

      {member.allergies && member.allergies.length > 0 && (
        <div className="tree-detail-section">
          <p className="tree-detail-label">Allergies</p>
          <div className="tree-detail-tags">
            {member.allergies.map(a => (
              <span key={a} className="badge badge-brown">⚠ {a}</span>
            ))}
          </div>
        </div>
      )}

      <div className="tree-detail-stats">
        <div className="tree-detail-stat">
          <Pill size={16} />
          <span>{activeMedicineCount}</span>
          <span>Medicines</span>
        </div>
        <div className="tree-detail-stat">
          <FileText size={16} />
          <span>{medicalRecordCount}</span>
          <span>Records</span>
        </div>
      </div>

      {member.emergencyContact && (
        <div className="tree-detail-emergency">
          <Phone size={13} />
          <span>
            <strong>{member.emergencyContactName ?? 'Contact'}</strong> · {member.emergencyContact}
          </span>
        </div>
      )}

      {/* Direct Module Navigation */}
      <div className="tree-detail-actions">
        <Link to="/medicines" className="tree-action-btn">
          <Pill size={14} />
          Medicines
          <ArrowRight size={12} />
        </Link>
        <Link to="/medical-records" className="tree-action-btn">
          <FileText size={14} />
          Records
          <ArrowRight size={12} />
        </Link>
        <Link to="/emergency" className="tree-action-btn emergency">
          <AlertTriangle size={14} />
          Emergency Card
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

function TreeNodeCard({
  member,
  selected,
  onSelect,
}: {
  member: FamilyMember;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const age = calcAge(member.dateOfBirth);

  return (
    <button
      className={`tree-node ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(member.id)}
      id={`tree-node-${member.id}`}
      aria-pressed={selected}
      aria-label={`${member.name}, ${member.relationship || member.relation}`}
    >
      <Avatar
        src={member.avatarUrl}
        initials={member.avatarInitials}
        name={member.name}
        size="md"
        color={member.avatarColor}
      />
      <div className="tree-node-info">
        <p className="tree-node-name">{member.name.split(' ')[0]}</p>
        <p className="tree-node-age">{member.relationship || member.relation} · {age} yrs</p>
      </div>
      <BloodBadge value={member.bloodGroup} />
    </button>
  );
}

function renderTree(
  node: TreeNode,
  membersMap: Map<string, FamilyMember>,
  selectedId: string | null,
  onSelect: (id: string) => void,
  depth = 0,
): React.ReactNode {
  const member = membersMap.get(node.memberId);
  if (!member) return null;

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div key={node.memberId} className={`tree-level depth-${depth}`}>
      <div className="tree-node-wrapper">
        <TreeNodeCard
          member={member}
          selected={selectedId === node.memberId}
          onSelect={onSelect}
        />
      </div>

      {hasChildren && (
        <>
          <div className="tree-connector-vertical" aria-hidden="true" />
          <div className="tree-children">
            {node.children!.map((child) => (
              <div key={child.memberId} className="tree-child-branch">
                <div className="tree-connector-child" aria-hidden="true" />
                {renderTree(child, membersMap, selectedId, onSelect, depth + 1)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function FamilyTree() {
  const db = useDB();
  const [selectedId, setSelectedId] = useState<string | null>('member-002'); // Default to Mom for quick inspection

  const membersMap = new Map<string, FamilyMember>();
  db.members.forEach(m => membersMap.set(m.id, m));

  const selectedMember = selectedId ? membersMap.get(selectedId) ?? null : null;

  const activeMedCount = selectedMember
    ? db.medicines.filter(m => m.familyMemberId === selectedMember.id && m.isActive).length
    : 0;
  const recordCount = selectedMember
    ? db.records.filter(r => r.familyMemberId === selectedMember.id).length
    : 0;

  return (
    <div className="family-tree-container">
      <div className="family-tree-scroll">
        <div className="family-tree" role="tree" aria-label="Patel family tree">
          {renderTree(DEFAULT_TREE, membersMap, selectedId, setSelectedId)}
        </div>
      </div>

      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          activeMedicineCount={activeMedCount}
          medicalRecordCount={recordCount}
          onClose={() => setSelectedId(null)}
        />
      )}

      <style>{treeStyles}</style>
    </div>
  );
}

const treeStyles = `
  .family-tree-container {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 2rem;
    align-items: start;
    min-height: 420px;
  }

  .family-tree-scroll {
    overflow-x: auto;
    padding: 1.5rem 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
  }

  .family-tree {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 540px;
  }

  .tree-level {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tree-node-wrapper {
    display: flex;
    justify-content: center;
  }

  .tree-node {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.125rem;
    background: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
    text-align: left;
    min-width: 175px;
  }

  .tree-node:hover {
    border-color: var(--color-terra);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .tree-node.selected {
    border-color: var(--color-terra);
    background: rgba(184,111,82,0.08);
    box-shadow: 0 0 0 3px rgba(184,111,82,0.18), var(--shadow-md);
  }

  .tree-node-info {
    flex: 1;
    min-width: 0;
  }

  .tree-node-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .tree-node-age {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-top: 1px;
  }

  /* Connectors */
  .tree-connector-vertical {
    width: 2px;
    height: 24px;
    background: var(--color-border-dark);
    margin: 0 auto;
  }

  .tree-children {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    position: relative;
  }

  .tree-child-branch {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .tree-connector-child {
    width: 2px;
    height: 24px;
    background: var(--color-border-dark);
  }

  /* Detail Card */
  .tree-detail {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    position: sticky;
    top: 1rem;
  }

  .tree-detail-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .tree-detail-info {
    flex: 1;
  }

  .tree-detail-info h3 {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    color: var(--color-text);
    margin: 0 0 0.125rem;
  }

  .tree-detail-info p {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    margin: 0 0 0.375rem;
  }

  .tree-detail-section {
    margin-bottom: 1rem;
  }

  .tree-detail-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.375rem;
  }

  .tree-detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .tree-detail-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin: 1.25rem 0;
    padding: 0.875rem;
    background: var(--color-bg);
    border-radius: var(--radius-md);
  }

  .tree-detail-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .tree-detail-stat span:first-of-type {
    font-family: var(--font-serif);
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .tree-detail-emergency {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--color-text);
    padding: 0.625rem 0.75rem;
    background: rgba(184,111,82,0.06);
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--color-terra);
    margin-bottom: 1.25rem;
  }

  .tree-detail-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tree-action-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .tree-action-btn:hover {
    background: var(--color-cream);
    border-color: var(--color-terra);
    color: var(--color-terra-dark);
  }

  .tree-action-btn.emergency:hover {
    border-color: #d97706;
    color: #b45309;
  }

  @media (max-width: 900px) {
    .family-tree-container {
      grid-template-columns: 1fr;
    }
  }
`;
