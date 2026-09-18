import { CalendarClock, FileText, Pill, Stethoscope, Syringe } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, EmptyState } from '@/components/ui';
import { useMember } from '@/lib/member';
import { useDB } from '@/lib/store';
import { buildTimeline, groupByMonth } from '@/lib/timeline';
import type { TimelineKind } from '@/lib/timeline';
import './timeline.css';

const KIND_ICON: Record<TimelineKind, typeof FileText> = {
  report: FileText,
  prescription: FileText,
  medicine: Pill,
  vaccination: Syringe,
  appointment: Stethoscope,
};

const KIND_LABEL: Record<TimelineKind, string> = {
  report: 'Report',
  prescription: 'Prescription',
  medicine: 'Medicine',
  vaccination: 'Vaccination',
  appointment: 'Appointment',
};

const FILTERS: (TimelineKind | 'all')[] = [
  'all', 'report', 'prescription', 'medicine', 'vaccination', 'appointment',
];

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

/**
 * One chronological view of everything on record for a family member, built
 * from the records themselves rather than a separate event list.
 */
export default function TimelinePage() {
  const { member } = useMember();
  const { records, medicines, vaccinations, appointments, doctors } = useDB();
  const [filter, setFilter] = useState<TimelineKind | 'all'>('all');

  if (!member) return null;

  const all = buildTimeline({ records, medicines, vaccinations, appointments }, member.id);
  const visible = filter === 'all' ? all : all.filter((e) => e.kind === filter);
  const months = groupByMonth(visible);
  const doctorName = (id?: string) => doctors.find((d) => d.id === id)?.name;

  return (
    <>
      <header className="page-head">
        <h1>Medical timeline</h1>
        <p>{member.name}’s health history, newest first.</p>
      </header>

      <div className="tl-filters" role="group" aria-label="Filter timeline by type">
        {FILTERS.map((f) => {
          const count = f === 'all' ? all.length : all.filter((e) => e.kind === f).length;
          if (f !== 'all' && count === 0) return null;
          return (
            <button
              key={f}
              type="button"
              className="tl-filter"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Everything' : KIND_LABEL[f]} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<CalendarClock size={34} />}
          title="Nothing recorded yet"
          hint={`Reports, medicines and vaccinations for ${member.name} will appear here as they are added.`}
        />
      ) : (
        <Card>
          {months.map((group) => (
            <section className="tl-month" key={group.label}>
              <h2 className="tl-month__label">{group.label}</h2>
              <div className="tl-list">
                {group.events.map((e) => {
                  const Icon = KIND_ICON[e.kind];
                  return (
                    <article className={`tl-event tl-event--${e.kind}`} key={e.id}>
                      <span className="tl-event__marker" aria-hidden="true"><Icon size={15} /></span>
                      <div className="tl-event__head">
                        <span className="tl-event__title">{e.title}</span>
                        <span className="tl-event__date">{longDate(e.date)}</span>
                      </div>
                      {e.detail && <p className="tl-event__detail">{e.detail}</p>}
                      <div className="tl-event__meta">
                        <span className="pill">{KIND_LABEL[e.kind]}</span>
                        {doctorName(e.doctorId) && (
                          <Link className="pill" to={`/doctors/${e.doctorId}`}>
                            {doctorName(e.doctorId)}
                          </Link>
                        )}
                        {e.recordId && (
                          <Link className="pill" to={`/records/${e.recordId}`}>
                            Open record
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </Card>
      )}
    </>
  );
}
