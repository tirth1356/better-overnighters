import { useState } from 'react';
import { Search, Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasNotifications] = useState(true);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="app-topbar" role="banner">
      {/* Search */}
      <div className="topbar-search">
        <Search size={16} className="topbar-search-icon" />
        <input
          id="topbar-search"
          type="text"
          placeholder="Search records, members, doctors…"
          className="topbar-search-input"
          aria-label="Search"
          readOnly
          onClick={() => {/* Person 4 will implement AI search */}}
        />
        <kbd className="topbar-search-kbd">⌘K</kbd>
      </div>

      <div className="topbar-actions">
        {/* Notifications */}
        <button
          id="topbar-notifications"
          className="topbar-icon-btn"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {hasNotifications && <span className="notification-dot" aria-hidden="true" />}
        </button>

        {/* User menu */}
        <div className="topbar-user-menu">
          <button
            id="topbar-user-btn"
            className="topbar-user-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Avatar
              initials={user?.name?.split(' ').map(w => w[0]).join('').slice(0,2)}
              name={user?.name}
              size="sm"
              color="var(--color-cream)"
            />
            <span className="topbar-user-name">{user?.name?.split(' ')[0] ?? 'User'}</span>
            <ChevronDown size={14} className={`topbar-chevron ${menuOpen ? 'open' : ''}`} />
          </button>

          {menuOpen && (
            <>
              <div
                className="topbar-overlay"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="topbar-dropdown" role="menu">
                <div className="topbar-dropdown-header">
                  <p className="topbar-dropdown-name">{user?.name}</p>
                  <p className="topbar-dropdown-email">{user?.email}</p>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.25rem 0' }} />
                <button
                  role="menuitem"
                  className="topbar-dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={15} />
                  Profile
                </button>
                <button
                  role="menuitem"
                  className="topbar-dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={15} />
                  Settings
                </button>
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.25rem 0' }} />
                <button
                  id="topbar-logout-btn"
                  role="menuitem"
                  className="topbar-dropdown-item danger"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{topbarStyles}</style>
    </header>
  );
}

const topbarStyles = `
  .topbar-search {
    flex: 1;
    max-width: 480px;
    position: relative;
    display: flex;
    align-items: center;
  }

  .topbar-search-icon {
    position: absolute;
    left: 0.875rem;
    color: var(--color-text-muted);
    pointer-events: none;
  }

  .topbar-search-input {
    width: 100%;
    background: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-full);
    padding: 0.5rem 2.75rem;
    font-size: 0.875rem;
    color: var(--color-text);
    cursor: pointer;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    outline: none;
  }

  .topbar-search-input::placeholder {
    color: var(--color-text-light);
  }

  .topbar-search-input:hover {
    border-color: var(--color-border-dark);
  }

  .topbar-search-kbd {
    position: absolute;
    right: 0.875rem;
    font-size: 0.75rem;
    color: var(--color-text-light);
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
    font-family: var(--font-sans);
  }

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }

  .topbar-icon-btn {
    position: relative;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .topbar-icon-btn:hover {
    background: var(--color-cream);
    color: var(--color-text);
  }

  .notification-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-terra);
    border: 1.5px solid var(--color-surface);
  }

  .topbar-user-menu {
    position: relative;
  }

  .topbar-user-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem 0.25rem 0.375rem;
    background: var(--color-surface-2);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .topbar-user-btn:hover {
    border-color: var(--color-border-dark);
    background: var(--color-cream);
  }

  .topbar-user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .topbar-chevron {
    color: var(--color-text-muted);
    transition: transform var(--transition-fast);
  }

  .topbar-chevron.open {
    transform: rotate(180deg);
  }

  .topbar-overlay {
    position: fixed;
    inset: 0;
    z-index: 49;
  }

  .topbar-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    width: 220px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 50;
    overflow: hidden;
    padding: 0.375rem;
    animation: fadeUp 0.15s ease;
  }

  .topbar-dropdown-header {
    padding: 0.625rem 0.75rem;
  }

  .topbar-dropdown-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .topbar-dropdown-email {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-top: 1px;
  }

  .topbar-dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    padding: 0.5625rem 0.75rem;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    cursor: pointer;
    text-align: left;
    transition: all var(--transition-fast);
  }

  .topbar-dropdown-item:hover {
    background: var(--color-cream);
    color: var(--color-text);
  }

  .topbar-dropdown-item.danger:hover {
    background: rgba(200, 90, 90, 0.08);
    color: #C85A5A;
  }
`;
