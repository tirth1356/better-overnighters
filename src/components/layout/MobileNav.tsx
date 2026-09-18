import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Pill,
  AlertTriangle,
} from 'lucide-react';

// Mobile bottom navigation — 5 most important items
const MOBILE_NAV = [
  { to: '/dashboard',       icon: LayoutDashboard, label: 'Home' },
  { to: '/family',          icon: Users,            label: 'Family' },
  { to: '/medical-records', icon: FileText,         label: 'Records' },
  { to: '/medicines',       icon: Pill,             label: 'Medicines' },
  { to: '/emergency',       icon: AlertTriangle,    label: 'Emergency' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {MOBILE_NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          end={to === '/dashboard'}
          id={`mobile-nav-${label.toLowerCase()}`}
        >
          <Icon size={22} strokeWidth={1.75} />
          <span>{label}</span>
        </NavLink>
      ))}

      <style>{mobileNavStyles}</style>
    </nav>
  );
}

const mobileNavStyles = `
  .mobile-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    z-index: 40;
    padding: 0 0.5rem;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    flex: 1;
    padding: 0.375rem 0.5rem;
    color: var(--color-text-light);
    font-size: 0.6875rem;
    font-weight: 500;
    text-decoration: none;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .mobile-nav-item:hover {
    color: var(--color-text-muted);
    background: var(--color-cream);
  }

  .mobile-nav-item.active {
    color: var(--color-terra);
  }

  @media (max-width: 768px) {
    .mobile-nav {
      display: flex;
    }
  }
`;
