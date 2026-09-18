import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DoseLog, Medicine } from '../../types';
import { calendarGrid, fromISODate, scheduleFor, toISODate } from '../../lib/schedule';

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Month view with one dot per dose outcome, so a day reads at a glance. */
export default function MedicineCalendar({
  medicines, doses, selected, onSelect,
}: {
  medicines: Medicine[];
  doses: DoseLog[];
  selected: string;
  onSelect: (date: string) => void;
}) {
  const today = toISODate(new Date());
  const [cursor, setCursor] = useState(() => {
    const d = fromISODate(selected);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const cells = useMemo(() => calendarGrid(cursor.year, cursor.month), [cursor]);

  const shift = (by: number) => {
    const d = new Date(cursor.year, cursor.month + by, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };

  return (
    <div>
      <div className="cal__head">
        <button type="button" className="icon-btn" onClick={() => shift(-1)} aria-label="Previous month">
          <ChevronLeft size={20} />
        </button>
        <span className="cal__month" aria-live="polite">
          {MONTHS[cursor.month]} {cursor.year}
        </span>
        <button type="button" className="icon-btn" onClick={() => shift(1)} aria-label="Next month">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="cal__grid" role="grid">
        {DOW.map((d, i) => (
          <div key={i} className="cal__dow" aria-hidden="true">{d}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`pad-${i}`} className="cal__day cal__day--outside" />;
          const slots = scheduleFor(medicines, doses, date, today);
          const dots = new Set(slots.map((s) => (s.status === 'skipped' ? 'taken' : s.status)));
          const day = Number(date.slice(8));
          const classes = [
            'cal__day',
            date === today ? 'cal__day--today' : '',
            date === selected ? 'cal__day--selected' : '',
          ].join(' ');
          return (
            <button
              key={date}
              type="button"
              className={classes}
              aria-current={date === today ? 'date' : undefined}
              aria-pressed={date === selected}
              aria-label={`${day} ${MONTHS[cursor.month]} — ${slots.length} doses`}
              onClick={() => onSelect(date)}
            >
              {day}
              <span className="cal__dots">
                {['taken', 'pending', 'missed']
                  .filter((s) => dots.has(s as never))
                  .map((s) => <span key={s} className={`cal__dot cal__dot--${s}`} />)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="cal__legend">
        <span><i className="cal__dot cal__dot--taken" /> Taken</span>
        <span><i className="cal__dot cal__dot--pending" /> Due</span>
        <span><i className="cal__dot cal__dot--missed" /> Missed</span>
      </div>
    </div>
  );
}
