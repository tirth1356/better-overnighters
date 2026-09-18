import { Users, Pill, FileText, CalendarClock } from 'lucide-react';
import { useDB } from '@/lib/store';

export default function OverviewCards() {
  const db = useDB();

  const totalMembers = db.members.length;
  const activeMedicines = db.medicines.filter(m => m.isActive).length;
  const totalRecords = db.records.length;
  const upcomingAppointments = (db.appointments || []).filter(a => a.status === 'Upcoming').length;

  const stats = [
    {
      label:    'Family Members',
      value:    totalMembers,
      icon:     Users,
      color:    'var(--color-brown)',
      bg:       'var(--color-cream)',
      sublabel: 'Active profiles',
    },
    {
      label:    'Active Medicines',
      value:    activeMedicines,
      icon:     Pill,
      color:    'var(--color-terra)',
      bg:       'rgba(184,111,82,0.1)',
      sublabel: 'Across all members',
    },
    {
      label:    'Medical Records',
      value:    totalRecords,
      icon:     FileText,
      color:    'var(--color-sage-dark)',
      bg:       'rgba(124,146,116,0.12)',
      sublabel: 'Total documents',
    },
    {
      label:    'Upcoming Apts.',
      value:    upcomingAppointments,
      icon:     CalendarClock,
      color:    '#5A8AC8',
      bg:       'rgba(90,138,200,0.1)',
      sublabel: 'This month',
    },
  ];

  return (
    <div className="overview-grid">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="stat-card"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="stat-card-top">
              <div
                className="stat-card-icon"
                style={{ background: s.bg, color: s.color }}
              >
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <span className="stat-card-label">{s.label}</span>
            </div>
            <p className="stat-card-value">{s.value}</p>
            <p className="stat-card-sublabel">{s.sublabel}</p>
          </div>
        );
      })}

      <style>{`
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .stat-card-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.875rem;
        }
        .stat-card-icon {
          width: 40px; height: 40px;
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .stat-card-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-muted);
        }
        .stat-card-value {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1;
          margin: 0 0 0.25rem;
        }
        .stat-card-sublabel {
          font-size: 0.8rem;
          color: var(--color-text-light);
        }
        @media (max-width: 900px) { .overview-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .overview-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
