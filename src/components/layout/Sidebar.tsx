import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Pill,
  Stethoscope,
  Syringe,
  AlertTriangle,
  LogOut,
  GitFork,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';
import Avatar from '@/components/ui/Avatar';

const NAV_ITEMS = [
  { to: '/dashboard',        icon: LayoutDashboard,  label: 'Dashboard' },
  { to: '/family',           icon: Users,             label: 'Family' },
  { to: '/family-tree',      icon: GitFork,           label: 'Family Tree' },
  { to: '/medical-records',  icon: FileText,          label: 'Medical Records' },
  { to: '/medicines',        icon: Pill,              label: 'Medicines' },
  { to: '/doctors',          icon: Stethoscope,       label: 'Doctors' },
  { to: '/vaccinations',     icon: Syringe,           label: 'Vaccinations' },
  { to: '/emergency',        icon: AlertTriangle,     label: 'Emergency' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="app-sidebar" aria-label="Main navigation">
      {/* Brand */}
      <div className="sidebar-brand">
        <Logo size={36} />
        <div>
          <span className="sidebar-brand-name">FamilyCare</span>
          <span className="sidebar-brand-sub">Health Manager</span>
        </div>
      </div>

      <hr className="divider" style={{ margin: '0 1rem' }} />

      {/* Navigation */}
      <div className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            end={to === '/dashboard'}
          >
            <Icon className="nav-icon" strokeWidth={1.75} />
            <span className="nav-label">{label}</span>
            <ChevronRight size={14} className="nav-chevron" />
          </NavLink>
        ))}
      </div>

      {/* Footer / User */}
      <div className="sidebar-footer">
        <hr className="divider" style={{ margin: '0 1rem 0.75rem' }} />
        <div className="sidebar-user">
          <Avatar
            initials={user?.name?.split(' ').map(w => w[0]).join('').slice(0,2)}
            name={user?.name}
            size="sm"
            color="var(--color-cream)"
          />
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name ?? 'Guest'}</p>
            <p className="sidebar-user-email">{user?.email ?? ''}</p>
          </div>
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="btn btn-ghost btn-sm sidebar-logout"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <style>{sidebarStyles}</style>
    </nav>
  );
}

const sidebarStyles = `
  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 1.25rem 1rem;
  }

  .sidebar-brand-name {
    display: block;
    font-family: var(--font-serif);
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-text);
    line-height: 1.2;
  }

  .sidebar-brand-sub {
    display: block;
    font-size: 0.6875rem;
    color: var(--color-text-muted);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 1px;
  }

  .sidebar-nav {
    flex: 1;
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column;
  }

  .nav-label { flex: 1; }

  .nav-chevron {
    opacity: 0;
    transition: opacity var(--transition-fast);
    color: currentColor;
  }

  .nav-item:hover .nav-chevron,
  .nav-item.active .nav-chevron {
    opacity: 0.6;
  }

  .sidebar-footer {
    padding-bottom: 0.75rem;
  }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 1rem;
  }

  .sidebar-user-info {
    flex: 1;
    min-width: 0;
  }

  .sidebar-user-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-user-email {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-logout {
    padding: 0.375rem;
    color: var(--color-text-muted);
    border-radius: var(--radius-sm);
    flex-shrink: 0;
  }

  .sidebar-logout:hover {
    color: #C85A5A;
    background: rgba(200, 90, 90, 0.08);
  }
`;
