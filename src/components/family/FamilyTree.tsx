import { useState } from 'react';
import type { FamilyMember } from '@/types';
import { mockFamilyMembers } from '@/data/mockData';
import Avatar from '@/components/ui/Avatar';
import { BloodBadge } from '@/components/ui/Badge';
import { calcAge } from '@/utils';
import { X, Pill, FileText, Phone } from 'lucide-react';

// ─── Tree layout definition ───────────────────────────────────────
// Grandfather (top)
//    Dad ── Mom
//       Tirth  Sister

interface TreeNode {
  memberId: string;
  children?: TreeNode[];
}

const TREE_STRUCTURE: TreeNode = {
  memberId: 'member-004', // Grandfather
  children: [
    {
      memberId: 'member-003', // Dad
      children: [
        { memberId: 'member-001' }, // Tirth
        { memberId: 'member-005' }, // Sister
      ],
    },
    {
      memberId: 'member-002', // Mom
    },
  ],
};

// ─── Detail panel ─────────────────────────────────────────────────
function MemberDetail({ member, onClose }: { member: FamilyMember; onClose: () => void }) {
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
          <p>{member.relationship} · {age} years</p>
          <BloodBadge value={member.bloodGroup} />
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      {member.conditions.length > 0 && (
        <div className="tree-detail-section">
          <p className="tree-detail-label">Conditions</p>
          <div className="tree-detail-tags">
            {member.conditions.map(c => (
              <span key={c} className="badge badge-terra">{c}</span>
            ))}
          </div>
        </div>
      )}

      {member.allergies.length > 0 && (
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
          <span>{member.activeMedicineCount ?? 0}</span>
          <span>Medicines</span>
        </div>
        <div className="tree-detail-stat">
          <FileText size={16} />
          <span>{member.medicalRecordCount ?? 0}</span>
          <span>Records</span>
        </div>
      </div>

      {member.emergencyContact && (
        <div className="tree-detail-emergency">
          <Phone size={13} />
          <span>
            <strong>{member.emergencyContactName}</strong> · {member.emergencyContact}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Single tree node ─────────────────────────────────────────────
function TreeNodeCard({
  memberId,
  selected,
  onSelect,
}: {
  memberId: string;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const member = mockFamilyMembers.find(m => m.id === memberId);
  if (!member) return null;
  const age = calcAge(member.dateOfBirth);

  return (
    <button
      className={`tree-node ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(memberId)}
      id={`tree-node-${memberId}`}
      aria-pressed={selected}
      aria-label={`${member.name}, ${member.relationship}`}
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
        <p className="tree-node-age">{age} yrs</p>
      </div>
      <BloodBadge value={member.bloodGroup} />
    </button>
  );
}

// ─── Recursive tree renderer ──────────────────────────────────────
function renderTree(
  node: TreeNode,
  selectedId: string | null,
  onSelect: (id: string) => void,
  depth = 0,
): React.ReactNode {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div key={node.memberId} className={`tree-level depth-${depth}`}>
      <div className="tree-node-wrapper">
        <TreeNodeCard
          memberId={node.memberId}
          selected={selectedId === node.memberId}
          onSelect={onSelect}
        />
      </div>

      {hasChildren && (
        <>
          <div className="tree-connector-vertical" aria-hidden="true" />
          <div className="tree-children">
            <div className="tree-connector-horizontal" aria-hidden="true" />
            {node.children!.map((child) => (
              <div key={child.memberId} className="tree-child-branch">
                <div className="tree-connector-child" aria-hidden="true" />
                {renderTree(child, selectedId, onSelect, depth + 1)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main FamilyTree component ────────────────────────────────────
export default function FamilyTree() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMember = selectedId
    ? mockFamilyMembers.find(m => m.id === selectedId) ?? null
    : null;

  return (
    <div className="family-tree-container">
      <div className="family-tree-scroll">
        <div className="family-tree" role="tree" aria-label="Patel family tree">
          {renderTree(TREE_STRUCTURE, selectedId, setSelectedId)}
        </div>
      </div>

      {selectedMember && (
        <MemberDetail
          member={selectedMember}
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
    grid-template-columns: 1fr auto;
    gap: 2rem;
    align-items: start;
    min-height: 400px;
  }

  .family-tree-scroll {
    overflow-x: auto;
    padding: 1rem;
  }

  .family-tree {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 600px;
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
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    background: var(--color-surface);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
    text-align: left;
    min-width: 160px;
  }

  .tree-node:hover {
    border-color: var(--color-terra);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .tree-node.selected {
    border-color: var(--color-terra);
    background: rgba(184,111,82,0.06);
    box-shadow: 0 0 0 3px rgba(184,111,82,0.15), var(--shadow-md);
  }

  .tree-node-info {
    flex: 1;
  }

  .tree-node-name {
    font-size: 0.875rem;
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
    height: 28px;
    background: var(--color-border-dark);
    margin: 0 auto;
  }

  .tree-children {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    position: relative;
  }

  .tree-connector-horizontal {
    position: absolute;
    top: 0;
    left: 50%;
    right: 50%;
    height: 2px;
    background: var(--color-border-dark);
    display: none; /* handled per child */
  }

  .tree-child-branch {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .tree-connector-child {
    width: 2px;
    height: 28px;
    background: var(--color-border-dark);
  }

  /* Cross-sibling connector */
  .tree-children::before {
    content: '';
    position: absolute;
    top: 0;
    left: calc(80px);
    right: calc(80px);
    height: 2px;
    background: var(--color-border-dark);
  }

  /* Detail panel */
  .tree-detail {
    width: 300px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
    position: sticky;
    top: calc(var(--topbar-height) + 1rem);
  }

  .tree-detail-header {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
  }

  .tree-detail-info {
    flex: 1;
  }

  .tree-detail-info h3 {
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 2px;
  }

  .tree-detail-info p {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    margin: 0 0 6px;
  }

  .tree-detail-section {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .tree-detail-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
  }

  .tree-detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .tree-detail-stats {
    display: flex;
    gap: 1rem;
  }

  .tree-detail-stat {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .tree-detail-stat span:nth-child(2) {
    font-weight: 700;
    color: var(--color-text);
    font-size: 1rem;
  }

  .tree-detail-emergency {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  @media (max-width: 900px) {
    .family-tree-container {
      grid-template-columns: 1fr;
    }

    .tree-detail {
      width: 100%;
      position: static;
    }
  }
`;
