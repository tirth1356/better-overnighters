import { Building2, Mail, Pencil, Phone, Plus, Stethoscope, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, EmptyState } from '../../components/ui';
import { deleteDoctor, useDB } from '../../lib/store';
import type { Doctor } from '../../types';
import { doctorSpecialty } from '@/lib/normalize';
import DoctorForm from './DoctorForm';
import './doctors.css';

export default function DoctorsPage() {
  const { doctors, medicines, records } = useDB();
  const [query, setQuery] = useState('');
  const [spec, setSpec] = useState('');
  const [form, setForm] = useState<{ open: boolean; editing?: Doctor }>({ open: false });

  const specializations = useMemo(
    () => [...new Set(doctors.map(doctorSpecialty).filter(Boolean))].sort(),
    [doctors],
  );

  const visible = doctors.filter((d) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      [d.name, doctorSpecialty(d), d.hospital, d.clinic]
        .some((f) => f?.toLowerCase().includes(q));
    return matchesQuery && (!spec || doctorSpecialty(d) === spec);
  });

  const linkCount = (id: string) =>
    records.filter((r) => r.doctorId === id).length + medicines.filter((m) => m.doctorId === id).length;

  return (
    <>
      <header className="page-head">
        <div className="page-head__row">
          <div>
            <h1>Doctors</h1>
            <p>Everyone your family sees, and what each of them handles.</p>
          </div>
          <button type="button" className="btn" onClick={() => setForm({ open: true })}>
            <Plus size={18} /> Add doctor
          </button>
        </div>
      </header>

      <div className="doctor-filter">
        <input
          type="search"
          placeholder="Search by name, hospital or clinic"
          aria-label="Search doctors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select aria-label="Filter by specialization" value={spec} onChange={(e) => setSpec(e.target.value)}>
          <option value="">All specializations</option>
          {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Stethoscope size={34} />}
          title={doctors.length === 0 ? 'No doctors yet' : 'No doctors match that search'}
          hint={doctors.length === 0 ? 'Add the doctors your family visits to link them to records and medicines.' : undefined}
        />
      ) : (
        <div className="grid grid--3">
          {visible.map((d) => (
            <Card key={d.id} className="doctor-card">
              <div className="doctor-card__top">
                <span className="doctor-card__avatar"><Stethoscope size={22} /></span>
                <div style={{ minWidth: 0 }}>
                  <div className="doctor-card__name">{d.name}</div>
                  <div className="doctor-card__spec">{doctorSpecialty(d)}</div>
                  {(d.hospital || d.clinic) && (
                    <div className="doctor-card__where">{[d.hospital, d.clinic].filter(Boolean).join(' · ')}</div>
                  )}
                </div>
              </div>

              <div className="doctor-card__contact">
                {d.phone && <a href={`tel:${d.phone.replace(/\s/g, '')}`}><Phone size={15} /> {d.phone}</a>}
                {d.email && <a href={`mailto:${d.email}`}><Mail size={15} /> {d.email}</a>}
                {d.address && <span className="doctor-card__where"><Building2 size={15} /> {d.address}</span>}
              </div>

              <span className="pill">{linkCount(d.id)} linked item{linkCount(d.id) === 1 ? '' : 's'}</span>

              <div className="doctor-card__actions">
                <Link className="btn btn--sm" to={`/doctors/${d.id}`}>View profile</Link>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setForm({ open: true, editing: d })}>
                  <Pencil size={15} /> Edit
                </button>
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  onClick={() => { if (confirm(`Remove ${d.name}?`)) deleteDoctor(d.id); }}
                >
                  <Trash2 size={15} />
                  <span className="visually-hidden">Remove {d.name}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {form.open && <DoctorForm editing={form.editing} onClose={() => setForm({ open: false })} />}
    </>
  );
}
