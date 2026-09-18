import { ArrowLeft, FileText, Mail, MapPin, Phone, Pill, Stethoscope } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Card, EmptyState } from '../../components/ui';
import { doctorSpecialty, dosesPerDay, recordKind } from '@/lib/normalize';
import { useDB } from '../../lib/store';
import './doctors.css';

/** Everything this doctor is attached to, pulled together by doctorId. */
export default function DoctorProfilePage() {
  const { doctorId } = useParams();
  const { doctors, medicines, records, members } = useDB();
  const doctor = doctors.find((d) => d.id === doctorId);

  if (!doctor) {
    return (
      <EmptyState
        icon={<Stethoscope size={34} />}
        title="Doctor not found"
        action={<Link className="btn" to="/doctors">Back to doctors</Link>}
      />
    );
  }

  const theirMedicines = medicines.filter((m) => m.doctorId === doctor.id);
  const theirRecords = records.filter((r) => r.doctorId === doctor.id);
  const reports = theirRecords.filter((r) => recordKind(r) === 'report');
  const prescriptions = theirRecords.filter((r) => recordKind(r) === 'prescription');
  const memberName = (id: string) => members.find((m) => m.id === id)?.name ?? 'Unknown';
  const treated = [
    ...new Set([...theirMedicines, ...theirRecords].map((x) => x.familyMemberId)),
  ];

  return (
    <>
      <Link to="/doctors" className="back-link"><ArrowLeft size={16} /> All doctors</Link>

      <header className="page-head">
        <h1>{doctor.name}</h1>
        <p>{doctorSpecialty(doctor)}{doctor.hospital ? ` · ${doctor.hospital}` : ''}</p>
      </header>

      <div className="grid grid--2" style={{ marginBottom: 'var(--space-5)' }}>
        <Card title="Contact">
          <div className="doctor-card__contact">
            {doctor.phone && <a href={`tel:${doctor.phone.replace(/\s/g, '')}`}><Phone size={15} /> {doctor.phone}</a>}
            {doctor.email && <a href={`mailto:${doctor.email}`}><Mail size={15} /> {doctor.email}</a>}
            {doctor.clinic && <span><Stethoscope size={15} /> {doctor.clinic}</span>}
            {doctor.address && <span><MapPin size={15} /> {doctor.address}</span>}
          </div>
          {doctor.notes && <p className="card__sub">{doctor.notes}</p>}
        </Card>

        <Card title="Family members seen" subtitle={`${treated.length} in this family`}>
          {treated.length === 0 ? (
            <p className="card__sub">Nothing linked to this doctor yet.</p>
          ) : (
            <div className="med-card__tags">
              {treated.map((id) => <span key={id} className="pill">{memberName(id)}</span>)}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid--2">
        <Card title="Reports" subtitle={`${reports.length} linked`}>
          {reports.length === 0 ? (
            <p className="card__sub">No reports linked to {doctor.name}.</p>
          ) : (
            <ul className="linked-list">
              {reports.map((r) => (
                <li key={r.id}>
                  <FileText size={17} />
                  <div className="linked-list__main">
                    <div className="linked-list__title">{r.title}</div>
                    <div className="linked-list__meta">{memberName(r.familyMemberId)} · {r.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Prescriptions" subtitle={`${prescriptions.length} linked`}>
          {prescriptions.length === 0 ? (
            <p className="card__sub">No prescriptions linked to {doctor.name}.</p>
          ) : (
            <ul className="linked-list">
              {prescriptions.map((r) => (
                <li key={r.id}>
                  <FileText size={17} />
                  <div className="linked-list__main">
                    <div className="linked-list__title">{r.title}</div>
                    <div className="linked-list__meta">{memberName(r.familyMemberId)} · {r.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Medicines prescribed" subtitle={`${theirMedicines.length} linked`}>
          {theirMedicines.length === 0 ? (
            <p className="card__sub">No medicines linked to {doctor.name}.</p>
          ) : (
            <ul className="linked-list">
              {theirMedicines.map((m) => (
                <li key={m.id}>
                  <Pill size={17} />
                  <div className="linked-list__main">
                    <div className="linked-list__title">{m.name} {m.dosage}</div>
                    <div className="linked-list__meta">
                      {memberName(m.familyMemberId)} · {dosesPerDay(m)}× daily
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Appointments" subtitle="Coming soon">
          <p className="card__sub">
            Appointment history will appear here once the scheduling module lands.
          </p>
        </Card>
      </div>
    </>
  );
}
