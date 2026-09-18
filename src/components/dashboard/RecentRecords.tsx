import { Link } from 'react-router-dom';
import { ArrowRight, FileText, FlaskConical, Scan, Stethoscope } from 'lucide-react';
import { useDB } from '@/lib/store';
import type { MedicalRecordType } from '@/types';
import { formatDate } from '@/utils';

function recordIcon(type: MedicalRecordType) {
  switch (type) {
    case 'Lab Report':    return <FlaskConical size={14} />;
    case 'Imaging':       return <Scan size={14} />;
    case 'Consultation':  return <Stethoscope size={14} />;
    default:              return <FileText size={14} />;
  }
}

function recordBadgeClass(type: MedicalRecordType): string {
  switch (type) {
    case 'Lab Report':    return 'badge badge-sage';
    case 'Imaging':       return 'badge badge-brown';
    case 'Consultation':  return 'badge badge-terra';
    default:              return 'badge badge-muted';
  }
}

export default function RecentRecords() {
  const db = useDB();
  const recent = db.records.slice(0, 5);

  return (
    <div className="card rr-card">
      <div className="rr-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Records</h2>
        <Link to="/medical-records" className="rr-see-all" id="rr-see-all-btn">
          See all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="rr-list">
        {recent.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', padding: '1rem 0' }}>
            No medical records yet. Upload a report to start your vault.
          </p>
        ) : (
          recent.map(record => {
            const member = db.members.find(m => m.id === record.familyMemberId);
            return (
              <Link
                key={record.id}
                to={`/records/${record.id}`}
                className="rr-row"
                id={`record-${record.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="rr-icon">
                  {recordIcon(record.type)}
                </div>
                <div className="rr-info">
                  <p className="rr-title">{record.title}</p>
                  <p className="rr-meta">
                    {member ? member.name.split(' ')[0] : '—'}
                    {record.doctorName ? ` · ${record.doctorName}` : ''}
                  </p>
                </div>
                <div className="rr-right">
                  <span className={recordBadgeClass(record.type)}>{record.type}</span>
                  <span className="rr-date">{formatDate(record.date)}</span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <style>{`
        .rr-card { padding: 1.5rem; }
        .rr-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .rr-see-all { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; font-weight: 500; color: var(--color-terra); text-decoration: none; transition: gap var(--transition-fast); }
        .rr-see-all:hover { gap: 0.5rem; color: var(--color-terra-dark); }
        .rr-list { display: flex; flex-direction: column; }
        .rr-row {
          display: flex; align-items: center; gap: 0.875rem;
          padding: 0.875rem 0;
          border-bottom: 1px solid var(--color-border);
          transition: background 0.15s ease;
        }
        .rr-row:last-child { border-bottom: none; }
        .rr-row:hover { background: var(--color-bg); margin: 0 -0.5rem; padding-left: 0.5rem; padding-right: 0.5rem; border-radius: var(--radius-sm); }
        .rr-icon {
          width: 36px; height: 36px;
          border-radius: var(--radius-md);
          background: var(--color-cream);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-brown);
          flex-shrink: 0;
        }
        .rr-info { flex: 1; min-width: 0; }
        .rr-title { font-size: 0.9rem; font-weight: 600; color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .rr-meta { font-size: 0.8rem; color: var(--color-text-muted); }
        .rr-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; flex-shrink: 0; }
        .rr-date { font-size: 0.75rem; color: var(--color-text-light); }
        @media (max-width: 480px) { .rr-right .badge { display: none; } }
      `}</style>
    </div>
  );
}
