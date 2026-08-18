import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  // ─── ⚡ NEW: CONTROLLED FORM STATE HANDLERS ───
  const [netKey, setNetKey] = useState('Sparda1234512.05.85');
  const [pin, setPin] = useState('123456');
  
  // Interactive UI state safeguards
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ─── ⚡ NEW: SECURE BACKEND AUTHENTICATION LOOP ───
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload artifacts
    
    // Boundary validation guard checks
    if (!netKey.trim() || pin.length < 6) {
      setErrorMessage('Bitte geben Sie einen gültigen Sparda-NetKey und eine 6-stellige PIN ein.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Dispatch authorization parameters straight to your Express backend authentication route
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          netKey: netKey.trim(),
          pin: pin
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Fallback catch for standard banking credential mismatch errors
        throw new Error(data.message || 'Anmeldedaten sind ungültig (Falscher NetKey oder PIN).');
      }

      // If data matches, pass the authenticated user payload object up to your global App store core
      if (data.success && onLogin) {
        onLogin(data.user || { name: 'Thomas Müller', accountType: 'Girokonto' });
      }

    } catch (err) {
      console.error('AUTH GATEWAY FAILURE // Handshake halted:', err.message);
      setErrorMessage(err.message || 'Verbindung zum Anmeldeserver fehlgeschlagen. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-screen">
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

            {/* ─── ⚡ NEW: SERVER COMPLIANCE ERROR BANNER ─── */}
            {errorMessage && (
              <div style={{ color: 'var(--red)', padding: '10px', background: '#fef2f2', borderRadius: '6px', marginBottom: '14px', fontSize: '13px', fontWeight: '500' }}>
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Wrapped controls inside a traditional HTML form layout for clean keypress detection */}
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="login-user">Sparda-NetKey / Alias</label>
                <input
                  type="text"
                  id="login-user"
                  placeholder="z.B. Sparda1234512.05.85"
                  value={netKey}
                  onChange={(e) => setNetKey(e.target.value)}
                  disabled={isLoading}
                />
                <div className="login-hint">z.B. Sparda + Kundennummer + Geburtsdatum (TTMMJJJJ)</div>
              </div>

              <div className="form-group">
                <label htmlFor="login-pin">Online-PIN (6-stellig)</label>
                <input
                  type="password"
                  id="login-pin"
                  placeholder="•••••"
                  maxLength="6"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className="btn-login" 
                disabled={isLoading || !netKey || pin.length < 6}
                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                <span></span> {isLoading ? '⌛ Verbindung...' : 'Login'}
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
  );
};

export default Login;
