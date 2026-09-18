// Placeholder pages for Persons 2 and 3 to implement.
// Each page shows what will go here and who is responsible.

import { FileText, Pill, Stethoscope, Syringe, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  owner: string;
  features: string[];
}

function PlaceholderPage({ icon, title, description, owner, features }: PlaceholderPageProps) {
  return (
    <div className="animate-fade-up placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-icon">{icon}</div>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-desc">{description}</p>

        <div className="placeholder-owner-badge">
          <span>🚧</span>
          <span>Implemented by <strong>{owner}</strong></span>
        </div>

        <div className="placeholder-features">
          <p className="placeholder-features-title">Coming features:</p>
          <ul>
            {features.map(f => (
              <li key={f}>
                <span className="placeholder-feature-dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <Link to="/dashboard" className="btn btn-outline btn-md" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <style>{`
        .placeholder-page {
          min-height: calc(100dvh - var(--topbar-height));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .placeholder-card {
          max-width: 520px;
          width: 100%;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 3rem 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-lg);
        }
        .placeholder-icon {
          width: 72px; height: 72px;
          border-radius: var(--radius-xl);
          background: var(--color-cream);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-brown);
          margin-bottom: 0.5rem;
        }
        .placeholder-title {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          color: var(--color-text);
        }
        .placeholder-desc {
          font-size: 1rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          max-width: 360px;
        }
        .placeholder-owner-badge {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(184,111,82,0.08);
          border: 1px solid rgba(184,111,82,0.2);
          border-radius: var(--radius-full);
          padding: 0.375rem 1rem;
          font-size: 0.875rem;
          color: var(--color-terra-dark);
        }
        .placeholder-features {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          width: 100%;
          text-align: left;
        }
        .placeholder-features-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.75rem;
        }
        .placeholder-features ul {
          list-style: none;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .placeholder-features li {
          display: flex; align-items: center; gap: 0.625rem;
          font-size: 0.9rem; color: var(--color-text);
        }
        .placeholder-feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--color-terra);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export function MedicalRecordsPage() {
  return (
    <PlaceholderPage
      icon={<FileText size={32} strokeWidth={1.5} />}
      title="Medical Records"
      description="Upload, organise and search all medical documents, lab reports, imaging and discharge summaries for every family member."
      owner="Person 2"
      features={[
        'Upload and categorise reports',
        'View records per family member',
        'Filter by type and date',
        'AI-powered report summaries (Person 4)',
        'Share records with doctors',
      ]}
    />
  );
}

export function MedicinesPage() {
  return (
    <PlaceholderPage
      icon={<Pill size={32} strokeWidth={1.5} />}
      title="Medicine Tracker"
      description="Track daily medications, set reminders, mark doses as taken and manage refill schedules for the whole family."
      owner="Person 2"
      features={[
        'Daily dose schedule view',
        'Mark dose as taken / missed',
        'Refill reminders',
        'Medicine inventory overview',
        'AI prescription explanation (Person 4)',
      ]}
    />
  );
}

export function DoctorsPage() {
  return (
    <PlaceholderPage
      icon={<Stethoscope size={32} strokeWidth={1.5} />}
      title="Doctors"
      description="Manage your family's doctors and specialists, track appointments and keep contact information accessible."
      owner="Person 3"
      features={[
        'Add and manage doctor profiles',
        'Link doctors to family members',
        'View appointment history',
        'Schedule upcoming appointments',
        'Doctor notes and speciality tags',
      ]}
    />
  );
}

export function VaccinationsPage() {
  return (
    <PlaceholderPage
      icon={<Syringe size={32} strokeWidth={1.5} />}
      title="Vaccinations"
      description="Keep a complete vaccination record for every family member and get reminders for upcoming booster doses."
      owner="Person 3"
      features={[
        'Full vaccination history per member',
        'Due-date reminders',
        'WHO recommended schedule guide',
        'Batch number and hospital tracking',
        'Printable vaccination card',
      ]}
    />
  );
}

export function EmergencyPage() {
  return (
    <PlaceholderPage
      icon={<AlertTriangle size={32} strokeWidth={1.5} />}
      title="Emergency Health Card"
      description="One-tap emergency profiles for every family member — blood group, allergies, conditions and emergency contacts at a glance."
      owner="Person 3"
      features={[
        'Digital emergency health card per member',
        'Offline-accessible critical info',
        'QR code for first responders',
        'Emergency contact quick-dial',
        'Current medicines summary',
      ]}
    />
  );
}
