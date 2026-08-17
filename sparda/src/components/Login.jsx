import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Bitte geben Sie Ihre NetKey-ID und Ihr Passwort ein.');
      return;
    }

    setErrorMessage('');
      setIsLoading(true);

    // Simulate network authentication request
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Header / Logo */}
        <div className="login-header">
          <div className="login-logo-icon">
            <svg viewBox="0 0 100 100">
              <text y=".9em" fontSize="80" fontFamily="serif" fontWeight="bold" fill="white">
                S
              </text>
            </svg>
          </div>
          <h1 className="login-title">Sparda-<span>Bank</span></h1>
          <p className="login-subtitle">Anmeldung zum SpardaNetKey Online-Banking</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="login-error-alert" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="netkey">SpardaNetKey / Alias</label>
            <input
              type="text"
              id="netkey"
              className="form-input"
              placeholder="z. B. 12345678"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PIN / Passwort</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>NetKey merken</span>
            </label>
            <a href="#forgot-pin" className="login-link" onClick={(e) => e.preventDefault()}>
              PIN vergessen?
            </a>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner-container">
                <span className="spinner"></span> Anmelden...
              </span>
            ) : (
              'Sicher Anmelden →'
            )}
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="login-footer">
          <div className="security-badge">
            <span className="badge-icon">🔒</span> 256-Bit SSL Verschlüsselung
          </div>
          <div className="security-badge">
            <span className="badge-icon">🛡️</span> SpardaSecureGo+ geschützt
          </div>
        </div>
      </div>
    </div>
  );
}
