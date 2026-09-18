import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockFamilyMembers, getMedicinesForMember, getRecordsForMember } from '@/data/mockData';
import Avatar from '@/components/ui/Avatar';

export default function FamilyHealthSummary() {
  return (
    <div className="card fhs-card">
      <div className="fhs-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Family Health Summary</h2>
        <Link to="/family" className="fhs-see-all" id="fhs-see-all-btn">
          See all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="fhs-list">
        {mockFamilyMembers.map(member => {
          const medicines = getMedicinesForMember(member.id);
          const records   = getRecordsForMember(member.id);
          const taken     = member.activeMedicineCount ?? 0; // mock: assume all taken
          const total     = medicines.length;
          const progress  = total > 0 ? (taken / total) * 100 : 100;

          return (
            <Link
              key={member.id}
              to={`/family/${member.id}`}
              className="fhs-row"
              id={`fhs-member-${member.id}`}
            >
              <Avatar
                src={member.avatarUrl}
                initials={member.avatarInitials}
                name={member.name}
                size="sm"
                color={member.avatarColor}
              />
              <div className="fhs-member-info">
                <div className="fhs-member-top">
                  <span className="fhs-member-name">{member.name.split(' ')[0]}</span>
                  <span className="fhs-member-rel">{member.relationship}</span>
                </div>
                {total > 0 ? (
                  <div className="fhs-progress-row">
                    <div className="fhs-progress-bar">
                      <div className="fhs-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="fhs-progress-label">{taken}/{total} medicines</span>
                  </div>
                ) : (
                  <span className="fhs-no-med">No active medicines</span>
                )}
              </div>
              <div className="fhs-right">
                <div className="fhs-records">
                  <span className="fhs-records-count">{records.length}</span>
                  <span className="fhs-records-label">records</span>
                </div>
                {total > 0 && taken === total && (
                  <CheckCircle2 size={16} className="fhs-done-icon" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .fhs-card { padding: 1.5rem; }
        .fhs-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .fhs-see-all { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; font-weight: 500; color: var(--color-terra); text-decoration: none; transition: gap var(--transition-fast); }
        .fhs-see-all:hover { gap: 0.5rem; color: var(--color-terra-dark); }
        .fhs-list { display: flex; flex-direction: column; gap: 0; }
        .fhs-row {
          display: flex; align-items: center; gap: 0.875rem;
          padding: 0.875rem 0;
          border-bottom: 1px solid var(--color-border);
          text-decoration: none;
          transition: all var(--transition-fast);
          border-radius: var(--radius-sm);
        }
        .fhs-row:last-child { border-bottom: none; }
        .fhs-row:hover { background: var(--color-bg); margin: 0 -0.5rem; padding-left: 0.5rem; padding-right: 0.5rem; }
        .fhs-member-info { flex: 1; }
        .fhs-member-top { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.375rem; }
        .fhs-member-name { font-size: 0.9375rem; font-weight: 600; color: var(--color-text); }
        .fhs-member-rel { font-size: 0.8125rem; color: var(--color-text-light); }
        .fhs-progress-row { display: flex; align-items: center; gap: 0.625rem; }
        .fhs-progress-bar { flex: 1; max-width: 120px; height: 5px; background: var(--color-border); border-radius: 3px; overflow: hidden; }
        .fhs-progress-fill { height: 100%; background: var(--color-sage); border-radius: 3px; transition: width 0.5s ease; }
        .fhs-progress-label { font-size: 0.8rem; color: var(--color-text-muted); white-space: nowrap; }
        .fhs-no-med { font-size: 0.8rem; color: var(--color-text-light); }
        .fhs-right { display: flex; align-items: center; gap: 0.5rem; }
        .fhs-records { display: flex; flex-direction: column; align-items: flex-end; }
        .fhs-records-count { font-size: 1rem; font-weight: 700; color: var(--color-text); }
        .fhs-records-label { font-size: 0.7rem; color: var(--color-text-light); }
        .fhs-done-icon { color: var(--color-sage-dark); }
      `}</style>
    </div>
  );
}
