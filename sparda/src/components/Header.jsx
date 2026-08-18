import React, { useState, useEffect } from 'react';

const Header = ({ goTo, onLogout }) => {
  // ─── ⚡ NEW: REAL-TIME NOTIFICATION COUNTER STATE ───
  const [unreadCount, setUnreadCount] = useState(3); // Falls back to default visual layer spacing

  useEffect(() => {
    const fetchHeaderNotificationMetrics = async () => {
      try {
        // Query the live express route directly to grab real-time account mailbox metrics
        const response = await fetch('/api/v1/user/notifications/summary');
        const data = await response.json();
        
        if (data && typeof data.unreadMails === 'number') {
          setUnreadCount(data.unreadMails);
        }
      } catch (err) {
        console.error(" Header metadata sync failed:", err);
      }
    };

    fetchHeaderNotificationMetrics();
    
    // Optional Polling Interceptor: Checks the backend once every 10 seconds to auto-update across devices
    const interval = setInterval(fetchHeaderNotificationMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="header-greeting">Guten Tag, <strong>Thomas Müller</strong></div>

        <div className="header-actions">
          <button className="header-btn mail-btn" onClick={() => goTo('postfach')}>
            📬 Postfach
            {/* ⚡ FIXED: Linked to live unreadCount variable. Hides dynamically if no items remain */}
            {unreadCount > 0 && (
              <span className="mail-badge">{unreadCount}</span>
            )}
          </button>

          <button className="header-btn">🔔</button>

          <div className="header-user" onClick={() => goTo('profil')}>
            <div className="user-avatar">TM</div>
            <span className="user-name">Th. Müller</span>
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
