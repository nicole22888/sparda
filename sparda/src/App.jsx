import React, { useState, useEffect } from 'react';

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
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [unreadMailCount, setUnreadMailCount] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [currentPage, setCurrentPage] = useState('kontoübersicht');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const res = await fetch('/api/v1/auth/');
        const data = await res.json();

        if (data && data.success && data.user) {
          setUser(data.user);
          if (data.accounts) setAccounts(data.accounts);
          
          // Fetch dynamic notification / message counter
          fetchUnreadCount();
        }
      } catch (err) {
        console.error("SANTOS CORE ENGINE // Session verification error:", err);
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkActiveSession();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/v1/messages/unread-count');
      const data = await res.json();
      if (data && data.success) {
        setUnreadMailCount(data.count || 0);
      }
    } catch (err) {
      console.error("SANTOS CORE ENGINE // Unread count fetch failure:", err);
    }
  };

  const handleLoginSuccess = (authenticatedUser, userAccounts = []) => {
    setUser(authenticatedUser);
    if (userAccounts.length > 0) {
      setAccounts(userAccounts);
    }
    
    window.history.replaceState({}, document.title, window.location.pathname);
    setCurrentPage('kontoübersicht');
    fetchUnreadCount();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setUser(null);
      setAccounts([]);
      setUnreadMailCount(0);
      setCurrentPage('kontoübersicht');
    }
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

  // Helper formatting for dynamic user name display
  const getUserDisplayName = () => {
    if (!user || !user.name) return '';
    return user.name;
  };

  const getUserInitials = () => {
    if (!user || !user.name) return '';
    const parts = user.name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getUserShortName = () => {
    if (!user || !user.name) return '';
    const parts = user.name.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'kontoübersicht':
        return <Dashboard goTo={handlePageNavigation} user={user} accounts={accounts} />;
      case 'umsätze':
        return <Umsaetze goTo={handlePageNavigation} user={user} accounts={accounts} />;
      case 'überweisung':
        return <Ueberweisung goTo={handlePageNavigation} user={user} accounts={accounts} />;
      case 'dauerauftrag':
        return <Dauerauftrag goTo={handlePageNavigation} user={user} />;
      case 'depot':
        return <Depot goTo={handlePageNavigation} user={user} accounts={accounts} />;
      case 'sparkonto':
        return <Sparkonto goTo={handlePageNavigation} user={user} accounts={accounts} />;
      case 'postfach':
        return <Postfach goTo={handlePageNavigation} user={user} onReadStateChange={fetchUnreadCount} />;
      case 'karten':
        return <Karten goTo={handlePageNavigation} user={user} />;
      case 'profil':
        return <Profil goTo={handlePageNavigation} user={user} setUser={setUser} />;
      default:
        return <Dashboard goTo={handlePageNavigation} user={user} accounts={accounts} />;
    }
  };

  if (isAuthenticating) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-main, #f4f6f9)' }}>
        <div style={{ textAlign: 'center', color: 'var(--gray-600, #666)' }}>
          ⌛ Sitzung wird überprüft...
        </div>
      </div>
    );
  }

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
            Guten Tag, <strong>{getUserDisplayName()}</strong>
          </div>

          <div className="header-actions">
            <button
              className="header-btn mail-btn"
              onClick={() => handlePageNavigation('postfach')}
            >
              📬 Postfach
              {unreadMailCount > 0 && <span className="mail-badge">{unreadMailCount}</span>}
            </button>

            <button className="header-btn">
              🔔
            </button>

            <div
              className="header-user"
              onClick={() => handlePageNavigation('profil')}
            >
              <div className="user-avatar">
                {getUserInitials()}
              </div>

              <span className="user-name">
                {getUserShortName()}
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
            {unreadMailCount > 0 && <span className="sidebar-item-badge">{unreadMailCount}</span>}
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
