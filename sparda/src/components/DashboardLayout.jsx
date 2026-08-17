import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children, onLogout, unreadMailCount = 3 }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: 'Kontoübersicht', path: '/konto', icon: '🏠' },
    { label: 'Umsätze', path: '/umsaetze', icon: '📊' },
    { label: 'Überweisung', path: '/ueberweisung', icon: '💸' },
    { label: 'Daueraufträge', path: '/dauerauftrag', icon: '🔄' },
    { label: 'UnionDepot', path: '/depot', icon: '📈' },
    { label: 'SpardaSpar Flex', path: '/sparkonto', icon: '🐷' },
    { label: 'Postfach', path: '/postfach', icon: '📬', badge: unreadMailCount },
    { label: 'Kartenverwaltung', path: '/karten', icon: '💳' },
    { label: 'Profil & Sicherheit', path: '/profil', icon: '⚙️' },
  ];

  return (
    <div id="app" style={{ display: 'block' }}>
      {/* App Header */}
      <header className="app-header">
        <div className="app-header-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 100 100">
              <text y=".9em" fontSize="80" fontFamily="serif" fontWeight="bold" fill="white">
                S
              </text>
            </svg>
          </div>
          <span className="logo-label">
            Sparda-<span>Bank</span>
          </span>
        </div>

        <div className="app-header-main">
          <div className="header-greeting">
            Guten Tag, <strong>ix_prinx</strong>
          </div>

          <div className="header-actions">
            <Link to="/postfach" className="header-btn mail-btn">
              📬 Postfach{' '}
              {unreadMailCount > 0 && (
                <span className="mail-badge">{unreadMailCount}</span>
              )}
            </Link>
            
            <button className="header-btn" title="Benachrichtigungen">
              🔔
            </button>

            <Link to="/profil" className="header-user">
              <div className="user-avatar">IX</div>
              <span className="user-name">ix_prinx</span>
              <span style={{ color: 'var(--gray-400)', fontSize: '10px' }}>▾</span>
            </Link>

            <button
              className="header-btn"
              onClick={onLogout}
              style={{ borderColor: 'var(--red)', color: 'var(--red)' }}
              title="Abmelden"
            >
              ⏏ Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Page Content */}
      <div className="app-body" style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)' }}>
        {/* Navigation Sidebar */}
        <nav className="app-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Hauptmenü</div>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span className="sidebar-item-label">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '1rem', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
            <div>BLZ: 300 600 10</div>
            <div>SpardaSecureGo+ Aktiv</div>
          </div>
        </nav>

        {/* Page Content Render Zone */}
        <main className="app-main" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
