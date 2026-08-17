import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [user, setUser] = useState('Sparda1234512.05.85');
  const [pin, setPin] = useState('123456');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !pin) {
      alert('Bitte geben Sie Ihren Sparda-NetKey und Ihre PIN ein.');
      return;
    }
    // Fire the prop function to transition to the App Shell
    onLogin();
  };

  return (
    <>
      <div className="demo-banner">
        ⚠️ DEMO · Nur zu Demonstrations- und Lernzwecken · Kein echtes Konto · Demo for educational purposes only ⚠️
      </div>

      <div className="login-screen">
        <nav className="login-nav">
          <a className="sparda-logo" href="#">
            <div className="sparda-logo-icon">
              <svg viewBox="0 0 100 100">
                <text y=".9em" fontSize="80" fontFamily="serif" fontWeight="bold">S</text>
              </svg>
            </div>
            <span className="sparda-logo-text">Sparda-<span>Bank</span></span>
          </a>
          <div className="login-nav-links">
            <a href="#">Girokonto</a>
            <a href="#">Sparen</a>
            <a href="#">Immobilien</a>
            <a href="#">Versicherungen</a>
            <a href="#">Depot</a>
            <a href="#">Service</a>
          </div>
        </nav>

        <div className="login-hero">
          <div className="login-hero-inner">
            <div className="login-hero-copy">
              <h1>Ihr Banking.<br /><strong>Einfach. Sicher. Digital.</strong></h1>
              <p>Mit dem Online-Banking der Sparda-Bank haben Sie Ihre Finanzen jederzeit im Blick – auf allen Geräten.</p>
              <div className="login-hero-badges">
                <span className="hero-badge">TÜV-geprüft sicher</span>
                <span className="hero-badge">SpardaSecureGo+</span>
                <span className="hero-badge">UnionDepot</span>
                <span className="hero-badge">Echtzeit-Überweisung</span>
              </div>
            </div>

            <div className="login-card">
              <h2>Online-Banking</h2>
              <div className="login-card-sub">Melden Sie sich mit Ihrem Sparda-NetKey an.</div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Sparda-NetKey / Alias</label>
                  <input 
                    type="text" 
                    value={user} 
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="z.B. Sparda1234512.05.85" 
                  />
                  <div className="login-hint">z.B. Sparda + Kundennummer + Geburtsdatum (TTMMJJJJ)</div>
                </div>

                <div className="form-group">
                  <label>Online-PIN (6-stellig)</label>
                  <input 
                    type="password" 
                    value={pin} 
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••" 
                  />
                </div>

                <button type="submit" className="btn-login">
                  <span>🔐</span> Anmelden
                </button>
              </form>

              <div className="login-links">
                <a href="#">Alias vergessen?</a>
                <a href="#">PIN vergessen?</a>
              </div>

              <div className="login-securego">
                <span className="login-securego-icon">📱</span>
                <div>
                  <strong>SpardaSecureGo+</strong>
                  Freigabe per App – kein TAN mehr nötig. Sicher und bequem.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
