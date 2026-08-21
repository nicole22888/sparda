import React from 'react';

const Header = ({ user, goTo, onLogout, unreadCount }) => {

  const fullName = user?.name || user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
  
  const getAvatarInitials = () => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getShortName = () => {
    if (!fullName) return '';

    const parts = fullName.trim().split(' ');

    if (parts.length === 1) return parts[0];

    const firstInitial = parts[0].endsWith('.')
      ? parts[0]
      : `${parts[0][0]}.`;

    return `${firstInitial} ${parts.slice(1).join(' ')}`;
  };

  return (
    <header className="app-header">
      <div className="app-header-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 100 100">
            <text y=".9em" fontSize="80" fontFamily="serif" fontWeight="bold" fill="white">S</text>
          </svg>
        </div>
        <span className="logo-label">Sparda-<span>Bank</span></span>
      </div>

      <div className="app-header-main">
        <div className="header-greeting">Guten Tag, <strong>{fullName}</strong></div>

        <div className="header-actions">
          <button className="header-btn mail-btn" onClick={() => goTo('postfach')}>
            📬 Postfach
            {unreadCount > 0 && (
              <span className="mail-badge">{unreadCount}</span>
            )}
          </button>

          <button className="header-btn">🔔</button>

          <div className="header-user" onClick={() => goTo('profil')}>
            <div className="user-avatar">{getAvatarInitials()}</div>
            <span className="user-name">{getShortName()}</span>
            <span style={{ color: 'var(--gray-400)', fontSize: '10px' }}>▾</span>
          </div>

          <button
            className="header-btn"
            onClick={onLogout}
            style={{ borderColor: 'var(--red)', color: 'var(--red)' }}
          >
            ⏏ Abmelden
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
