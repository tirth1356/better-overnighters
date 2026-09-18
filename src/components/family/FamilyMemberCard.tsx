import { ArrowRight, Pill, FileText, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FamilyMember } from '@/types';
import { BloodBadge, Badge } from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { calcAge } from '@/utils';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onEdit?:   (member: FamilyMember) => void;
  onDelete?: (id: string) => void;
}

export default function FamilyMemberCard({ member, onEdit, onDelete }: FamilyMemberCardProps) {
  const age = calcAge(member.dateOfBirth);

  return (
    <article className="family-card animate-fade-up" aria-label={`Health profile for ${member.name}`}>
      {/* Card top */}
      <div className="family-card-top">
        <Avatar
          src={member.avatarUrl}
          initials={member.avatarInitials}
          name={member.name}
          size="lg"
          color={member.avatarColor ?? 'var(--color-cream)'}
        />
        <div className="family-card-identity">
          <h3 className="family-card-name">{member.name}</h3>
          <p className="family-card-relation">{member.relationship}</p>
          <div className="family-card-meta">
            <span className="family-card-age">{age} yrs</span>
            <span className="family-card-dot" />
            <span className="family-card-gender">{member.gender}</span>
          </div>
        </div>
        <BloodBadge value={member.bloodGroup} />
      </div>

      {/* Conditions / allergies */}
      {(member.conditions.length > 0 || member.allergies.length > 0) && (
        <div className="family-card-tags">
          {member.conditions.slice(0, 2).map(c => (
            <Badge key={c} variant="terra">{c}</Badge>
          ))}
          {member.allergies.slice(0, 1).map(a => (
            <Badge key={a} variant="brown">⚠ {a}</Badge>
          ))}
          {member.conditions.length + member.allergies.length > 3 && (
            <Badge variant="muted">+{member.conditions.length + member.allergies.length - 3} more</Badge>
          )}
        </div>
      )}

      <hr className="family-card-divider" />

      {/* Stats */}
      <div className="family-card-stats">
        <div className="family-card-stat">
          <Pill size={14} className="family-card-stat-icon" />
          <span className="family-card-stat-value">{member.activeMedicineCount ?? 0}</span>
          <span className="family-card-stat-label">medicines</span>
        </div>
        <div className="family-card-stat-sep" />
        <div className="family-card-stat">
          <FileText size={14} className="family-card-stat-icon" />
          <span className="family-card-stat-value">{member.medicalRecordCount ?? 0}</span>
          <span className="family-card-stat-label">records</span>
        </div>
      </div>

      {/* Footer */}
      <div className="family-card-footer">
        <Link
          to={`/family/${member.id}`}
          className="family-card-view-btn"
          id={`view-member-${member.id}`}
        >
          View Health
          <ArrowRight size={14} />
        </Link>

        <div className="family-card-actions">
          {onEdit && (
            <button
              id={`edit-member-${member.id}`}
              className="btn btn-ghost btn-sm family-card-action-btn"
              onClick={() => onEdit(member)}
              aria-label={`Edit ${member.name}`}
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              id={`delete-member-${member.id}`}
              className="btn btn-ghost btn-sm family-card-action-btn danger"
              onClick={() => onDelete(member.id)}
              aria-label={`Remove ${member.name}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <style>{cardStyles}</style>
    </article>
  );
}

const cardStyles = `
  .family-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
  }

  .family-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-terra), var(--color-brown));
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .family-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-3px);
    border-color: var(--color-border-dark);
  }

  .family-card:hover::before {
    opacity: 1;
  }

  .family-card-top {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
  }

  .family-card-identity {
    flex: 1;
    min-width: 0;
  }

  .family-card-name {
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .family-card-relation {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    margin: 1px 0 4px;
  }

  .family-card-meta {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .family-card-age,
  .family-card-gender {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    font-weight: 500;
  }

  .family-card-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--color-text-light);
  }

  .family-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .family-card-divider {
    border: none;
    border-top: 1px solid var(--color-border);
  }

  .family-card-stats {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .family-card-stat {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .family-card-stat-icon {
    color: var(--color-text-light);
  }

  .family-card-stat-value {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .family-card-stat-label {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  .family-card-stat-sep {
    width: 1px;
    height: 20px;
    background: var(--color-border);
  }

  .family-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .family-card-view-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-terra);
    text-decoration: none;
    transition: gap var(--transition-fast), color var(--transition-fast);
  }

  .family-card-view-btn:hover {
    gap: 0.625rem;
    color: var(--color-terra-dark);
  }

  .family-card-actions {
    display: flex;
    gap: 0.25rem;
  }

  .family-card-action-btn {
    color: var(--color-text-muted);
    padding: 0.375rem;
  }

  .family-card-action-btn:hover {
    color: var(--color-text);
    background: var(--color-cream);
  }

  .family-card-action-btn.danger:hover {
    color: #C85A5A;
    background: rgba(200,90,90,0.08);
  }
`;
