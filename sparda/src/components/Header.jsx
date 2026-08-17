import React from 'react';

const Header = ({ goTo, onLogout }) => {
return (
<header className="app-header">
  <div className="app-header-logo">
    <div className="logo-icon">
      <svg viewBox="0 0 100 100"><text y=".9em" fontSize="80" fontFamily="serif" fontWeight="bold" fill="white">S</text></svg>
    </div>
    <span className="logo-label">Sparda-<span>Bank</span></span>
  </div>

  <div className="app-header-main">
    <div className="header-greeting">Guten Tag, <strong>Thomas Müller</strong></div>

    <div className="header-actions">
      <button className="header-btn mail-btn" onClick={() => goTo('postfach')}>
        📬 Postfach
        <span className="mail-badge">3</span>
      </button>

      <button className="header-btn">🔔</button>

      <div className="header-user" onClick={() => goTo('profil')}>
        <div className="user-avatar">TM</div>
        <span className="user-name">Th. Müller</span>
        <span style={{color:'var(--gray-400)',fontSize:'10px'}}>▾</span>
      </div>

      <button
        className="header-btn"
        onClick={onLogout}
        style={{borderColor:'var(--red)',color:'var(--red)'}}
      >
        ⏏ Abmelden
      </button>
    </div>
  </div>
</header>
);
};

export default Header;
