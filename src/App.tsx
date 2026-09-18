import { HeartPulse, Pill, Sparkles, Stethoscope, Syringe, ShieldAlert } from 'lucide-react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './app.css';
import { MemberProvider, initials, useMember } from './lib/member';
import MedicinesPage from './features/medicines/MedicinesPage';
import DoctorsPage from './features/doctors/DoctorsPage';
import DoctorProfilePage from './features/doctors/DoctorProfilePage';
import VaccinationsPage from './features/vaccinations/VaccinationsPage';
import EmergencyPage from './features/emergency/EmergencyPage';
import ExplainPage from './features/ai/ExplainPage';

/**
 * Shell + routing for the Person 3 modules. Person 1 owns the final app shell:
 * when their layout lands, keep the <Route> entries below and drop this chrome.
 */
const NAV = [
  { to: '/medicines', label: 'Medicines', icon: Pill },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/vaccinations', label: 'Vaccinations', icon: Syringe },
  { to: '/emergency', label: 'Emergency card', icon: ShieldAlert },
  { to: '/explain', label: 'Understand a report', icon: Sparkles },
];

function MemberSwitch() {
  const { member, members, setMemberId } = useMember();
  return (
    <div className="member-switch">
      <span className="member-switch__label" id="member-switch-label">Viewing</span>
      <div role="group" aria-labelledby="member-switch-label">
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            className="member-chip"
            aria-pressed={m.id === member?.id}
            onClick={() => setMemberId(m.id)}
          >
            <span className="avatar" aria-hidden="true">{initials(m.name)}</span>
            <span>
              <span className="member-chip__name">{m.name}</span>
              <br />
              <span className="member-chip__rel">{m.relation}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MemberProvider>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand__mark"><HeartPulse size={21} /></span>
            <span>
              <span className="brand__name">Better Overnighters</span>
              <br />
              <span className="brand__tag">Family health</span>
            </span>
          </div>
          <nav className="nav" aria-label="Health modules">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <MemberSwitch />
        </aside>
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/medicines" replace />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:doctorId" element={<DoctorProfilePage />} />
            <Route path="/vaccinations" element={<VaccinationsPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/explain" element={<ExplainPage />} />
          </Routes>
        </main>
      </div>
    </MemberProvider>
  );
}
