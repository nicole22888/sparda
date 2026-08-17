import React from 'react';

const Navigation = ({ goTo }) => {
return (
<nav className="app-sidebar">
  <div className="sidebar-section">
    <div className="sidebar-section-title">Konten</div>
    <button className="sidebar-item active" onClick={() => goTo('kontoübersicht')}>
      <span className="sidebar-item-icon">🏠</span> Kontoübersicht
    </button>
    <button className="sidebar-item" onClick={() => goTo('umsätze')}>
      <span className="sidebar-item-icon">📋</span> Umsätze
    </button>
  </div>

  <hr className="sidebar-divider" />

  <div className="sidebar-section">
    <div className="sidebar-section-title">Zahlungsverkehr</div>
    <button className="sidebar-item" onClick={() => goTo('überweisung')}>
      <span className="sidebar-item-icon">↗️</span> Überweisung
    </button>
    <button className="sidebar-item" onClick={() => goTo('dauerauftrag')}>
      <span className="sidebar-item-icon">🔄</span> Dauerauftrag
    </button>
  </div>

  <hr className="sidebar-divider" />

  <div className="sidebar-section">
    <div className="sidebar-section-title">Anlage & Depot</div>
    <button className="sidebar-item" onClick={() => goTo('depot')}>
      <span className="sidebar-item-icon">📈</span> UnionDepot
    </button>
    <button className="sidebar-item" onClick={() => goTo('sparkonto')}>
      <span className="sidebar-item-icon">🐷</span> SpardaSpar
    </button>
  </div>

  <hr className="sidebar-divider" />

  <div className="sidebar-section">
    <div className="sidebar-section-title">Service</div>
    <button className="sidebar-item" onClick={() => goTo('postfach')}>
      <span className="sidebar-item-icon">📬</span> Postfach
      <span className="sidebar-item-badge">3</span>
    </button>
    <button className="sidebar-item" onClick={() => goTo('karten')}>
      <span className="sidebar-item-icon">💳</span> Meine Karten
    </button>
    <button className="sidebar-item" onClick={() => goTo('profil')}>
      <span className="sidebar-item-icon">👤</span> Profil & Sicherheit
    </button>
  </div>
</nav>
);
};

export default Navigation;
