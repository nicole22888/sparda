import React, { useState } from 'react';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Umsaetze from './components/Umsaetze';
import Ueberweisung from './components/Ueberweisung';
import Dauerauftrag from './components/Dauerauftrag';
import Depot from './components/Depot';
import Sparkonto from './components/Sparkonto';
import Postfach from './components/Postfach';
import Karten from './components/Karten';
import Profil from './components/Profil';

import './components/Login.css';

function App() {

  const [user, setUser] = useState(null); // Boot up locked until backend validates session token
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentPage, setCurrentPage] = useState('kontoübersicht'); // Tracks your page navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleLoginSuccess = (authenticatedUser) => {

    setUser(authenticatedUser);
    
    window.history.replaceState({}, document.title, window.location.pathname);
    
    setCurrentPage('kontoübersicht');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('kontoübersicht');
  };

  const handlePageNavigation = (destinationString) => {
    if (destinationString.includes('?')) {
      const [targetPage, queryString] = destinationString.split('?');
      const newRelativePath = window.location.pathname + '?' + queryString;
      window.history.pushState({}, '', newRelativePath);
      
      setCurrentPage(targetPage);
    } else {
      window.history.pushState({}, '', window.location.pathname);
      setCurrentPage(destinationString);
    }
    setIsMobileMenuOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'kontoübersicht':
        return <Dashboard goTo={handlePageNavigation} />;
      case 'umsätze':
        return <Umsaetze goTo={handlePageNavigation} />;
      case 'überweisung':
        return <Ueberweisung goTo={handlePageNavigation} />;
      case 'dauerauftrag':
        return <Dauerauftrag goTo={handlePageNavigation} />;
      case 'depot':
        return <Depot goTo={handlePageNavigation} />;
      case 'sparkonto':
        return <Sparkonto goTo={handlePageNavigation} />;
      case 'postfach':
        return <Postfach goTo={handlePageNavigation} />;
      case 'karten':
        return <Karten goTo={handlePageNavigation} />;
      case 'profil':
        return <Profil goTo={handlePageNavigation} />;
      default:
        return <Dashboard goTo={handlePageNavigation} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <div id="app">
      <header className="app-header">
        <div className="app-header-logo">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
          <div className="logo-icon">
            <svg viewBox="0 0 100 100">
              <text
                y=".9em"
                fontSize="80"
                fontFamily="serif"
                fontWeight="bold"
                fill="white"
              >
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
            Guten Tag, <strong>{user?.name || 'Thomas Müller'}</strong>
          </div>

          <div className="header-actions">
            <button
              className="header-btn mail-btn"
              onClick={() => handlePageNavigation('postfach')}
            >
              📬 Postfach
              <span className="mail-badge">3</span>
            </button>

            <button className="header-btn">
              🔔
            </button>

            <div
              className="header-user"
              onClick={() => handlePageNavigation('profil')}
            >
              <div className="user-avatar">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'TM'}
              </div>

              <span className="user-name">
                {user?.name ? user.name.split(' ')[0][0] + '. ' + user.name.split(' ').slice(1).join(' ') : 'Th. Müller'}
              </span>

              <span
                style={{
                  color: 'var(--gray-400)',
                  fontSize: '10px'
                }}
              >
                ▾
              </span>
            </div>
            
            <button
              className="header-btn"
              onClick={handleLogout}
              style={{
                borderColor: 'var(--red)',
                color: 'var(--red)'
              }}
            >
              ⏏ Abmelden
            </button>
          </div>
        </div>
      </header>

      <nav className={`app-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            Konten
          </div>

          <button
            className={`sidebar-item ${currentPage === 'kontoübersicht' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('kontoübersicht')}
          >
            <span className="sidebar-item-icon">🏠</span>
            Kontoübersicht
          </button>

          <button
            className={`sidebar-item ${currentPage === 'umsätze' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('umsätze')}
          >
            <span className="sidebar-item-icon">📋</span>
            Umsätze
          </button>
        </div>

        <hr className="sidebar-divider" />
        
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            Zahlungsverkehr
          </div>

          <button
            className={`sidebar-item ${currentPage === 'überweisung' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('überweisung')}
          >
            <span className="sidebar-item-icon">↗️</span>
            Überweisung
          </button>

          <button
            className={`sidebar-item ${currentPage === 'dauerauftrag' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('dauerauftrag')}
          >
            <span className="sidebar-item-icon">🔄</span>
            Dauerauftrag
          </button>
        </div>

        <hr className="sidebar-divider" />
        
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            Anlage & Depot
          </div>

          <button
            className={`sidebar-item ${currentPage === 'depot' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('depot')}
          >
            <span className="sidebar-item-icon">📈</span>
            UnionDepot
          </button>

          <button
            className={`sidebar-item ${currentPage === 'sparkonto' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('sparkonto')}
          >
            <span className="sidebar-item-icon">🐷</span>
            SpardaSpar
          </button>
        </div>

        <hr className="sidebar-divider" />

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            Service
          </div>

          <button
            className={`sidebar-item ${currentPage === 'postfach' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('postfach')}
          >
            <span className="sidebar-item-icon">📬</span>
            Postfach
            <span className="sidebar-item-badge">3</span>
          </button>

          <button
            className={`sidebar-item ${currentPage === 'karten' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('karten')}
          >
            <span className="sidebar-item-icon">💳</span>
            Meine Karten
          </button>

          <button
            className={`sidebar-item ${currentPage === 'profil' ? 'active' : ''}`}
            onClick={() => handlePageNavigation('profil')}
          >
            <span className="sidebar-item-icon">👤</span>
            Profil & Sicherheit
          </button>
        </div>
      </nav>

      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;