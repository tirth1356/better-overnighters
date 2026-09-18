import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, MapPin } from 'lucide-react';
import { getUpcomingAppointments, getMemberById } from '@/data/mockData';
import { daysUntil } from '@/utils';
import Avatar from '@/components/ui/Avatar';

export default function UpcomingAppointments() {
  const appointments = getUpcomingAppointments();

  return (
    <div className="card ua-card">
      <div className="ua-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Upcoming Appointments</h2>
        <Link to="/doctors" className="ua-see-all" id="ua-see-all-btn">
          See all <ArrowRight size={13} />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="ua-empty">
          <CalendarClock size={32} />
          <p>No upcoming appointments</p>
        </div>
      ) : (
        <div className="ua-list">
          {appointments.map(apt => {
            const member = getMemberById(apt.familyMemberId);
            const days   = daysUntil(apt.dateTime);
            const urgent = days <= 3;

            return (
              <div key={apt.id} className={`ua-row ${urgent ? 'urgent' : ''}`} id={`apt-${apt.id}`}>
                {/* Date pill */}
                <div className={`ua-date-pill ${urgent ? 'urgent' : ''}`}>
                  <span className="ua-date-day">
                    {new Date(apt.dateTime).getDate()}
                  </span>
                  <span className="ua-date-month">
                    {new Date(apt.dateTime).toLocaleString('en-IN', { month: 'short' })}
                  </span>
                </div>

                {/* Details */}
                <div className="ua-info">
                  <p className="ua-doctor">{apt.doctorName}</p>
                  <p className="ua-specialty">{apt.specialty}</p>
                  {apt.hospital && (
                    <p className="ua-hospital">
                      <MapPin size={11} />
                      {apt.hospital}
                    </p>
                  )}
                </div>

                {/* Member + countdown */}
                <div className="ua-right">
                  {member && (
                    <Avatar
                      initials={member.avatarInitials}
                      name={member.name}
                      size="xs"
                      color={member.avatarColor}
                    />
                  )}
                  <span className={`ua-days ${urgent ? 'urgent' : ''}`}>
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days}d`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .ua-card { padding: 1.5rem; }
        .ua-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .ua-see-all { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; font-weight: 500; color: var(--color-terra); text-decoration: none; transition: gap var(--transition-fast); }
        .ua-see-all:hover { gap: 0.5rem; color: var(--color-terra-dark); }
        .ua-empty { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 2rem 0; color: var(--color-text-light); text-align: center; }
        .ua-list { display: flex; flex-direction: column; }
        .ua-row {
          display: flex; align-items: center; gap: 0.875rem;
          padding: 0.875rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .ua-row:last-child { border-bottom: none; }
        .ua-row.urgent { background: rgba(184,111,82,0.03); margin: 0 -0.5rem; padding: 0.875rem 0.5rem; border-radius: var(--radius-md); }
        .ua-date-pill {
          width: 46px; flex-shrink: 0;
          display: flex; flex-direction: column; align-items: center;
          background: var(--color-cream);
          border-radius: var(--radius-md);
          padding: 0.375rem 0;
          border: 1px solid var(--color-border);
        }
        .ua-date-pill.urgent { background: rgba(184,111,82,0.1); border-color: rgba(184,111,82,0.3); }
        .ua-date-day { font-size: 1.125rem; font-weight: 700; color: var(--color-text); line-height: 1; }
        .ua-date-month { font-size: 0.6875rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 1px; }
        .ua-date-pill.urgent .ua-date-day,
        .ua-date-pill.urgent .ua-date-month { color: var(--color-terra-dark); }
        .ua-info { flex: 1; }
        .ua-doctor { font-size: 0.9rem; font-weight: 600; color: var(--color-text); margin-bottom: 1px; }
        .ua-specialty { font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 2px; }
        .ua-hospital { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--color-text-light); }
        .ua-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; }
        .ua-days { font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted); white-space: nowrap; }
        .ua-days.urgent { color: var(--color-terra); }
      `}</style>
    </div>
  );
}
