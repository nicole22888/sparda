import React, { useState, useEffect } from 'react';

const Header = ({ user, goTo, onLogout }) => {
  const [unreadCount, setUnreadCount] = useState(0); 

  useEffect(() => {
    const fetchHeaderNotificationMetrics = async () => {
      try {
        const response = await fetch('/api/v1/user/notifications/summary');
        const data = await response.json();
        
        if (data && typeof data.unreadMails === 'number') {
          setUnreadCount(data.unreadMails);
        }
      } catch (err) {
        console.error("Header metadata sync failed:", err);
      }
    };

    fetchHeaderNotificationMetrics();
    
    const interval = setInterval(fetchHeaderNotificationMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  
  const avatarInitials = `${firstName ? firstName.charAt(0) : ''}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
  const shortName = firstName && lastName ? `${firstName.substring(0, 2)}. ${lastName}` : fullName;

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
            <div className="user-avatar">{avatarInitials}</div>
            <span className="user-name">{shortName}</span>
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
