import React, { useState } from 'react';

function Profil() {
  // Core UI Toggles State Handlers
  const [secureGo, setSecureGo] = useState(true);
  const [smartTan, setSmartTan] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // ─── ⚡ NEW: SECURE BACKEND SIMULATION INTERFACE STATE ───
  const [updatingField, setUpdatingField] = useState(null);
  const [error, setError] = useState('');

  // ─── ⚡ NEW: ASYNCHRONOUS UPDATE HANDLER ───
  // Dispatches state modifications straight to your Express backend simulation loop
  const handleSecurityToggle = async (fieldName, currentValue, setterFunction) => {
    const newValue = !currentValue;
    setUpdatingField(fieldName);
    setError('');

    try {
      // 1. Optimistically change UI toggle state for premium reactive look
      setterFunction(newValue);

      // 2. Dispatch data update to your unified backend route structure
      const response = await fetch('/api/v1/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: fieldName, value: newValue })
      });

      if (!response.ok) {
        throw new Error('Database pipeline rejection.');
      }

      console.log(` Security Setting Updated: ${fieldName} ->`, newValue);

    } catch (err) {
      console.error('CRITICAL STATE MISMATCH // Reverting local UI element:', err);
      // Fail-Safe: Instantly roll toggle back to previous state if network drops
      setterFunction(currentValue);
      setError('Verbindung fehlgeschlagen. Änderung konnte nicht gespeichert werden.');
    } finally {
      setUpdatingField(null);
    }
  };

  return (
    <section className="page active" id="page-profil">
      <div className="page-header">
        <div className="page-title">Profil & Sicherheit</div>
        <div className="page-subtitle">Kundennummer: 123456 · Mitglied seit 2011</div>
      </div>

      {/* ─── ⚡ NEW: SERVER COMPLIANCE EXCEPTION BANNER ─── */}
      {error && (
        <div style={{ color: 'var(--red)', padding: '12px', background: '#fef2f2', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="profil-grid">
        <div className="profil-section">
          <div className="profil-section-title">Persönliche Daten</div>

          <div className="profil-row">
            <span className="profil-key">Vorname</span>
            <span className="profil-value">Thomas</span>
          </div>

          <div className="profil-row">
            <span className="profil-key">Nachname</span>
            <span className="profil-value">Müller</span>
          </div>

          <div className="profil-row">
            <span className="profil-key">Geburtsdatum</span>
            <span className="profil-value">12.05.1985</span>
          </div>

          <div className="profil-row">
            <span className="profil-key">Steuer-ID</span>
            <span className="profil-value">14 xxx xx xxx</span>
          </div>

          <div className="profil-row">
            <span className="profil-key">Adresse</span>
            <span className="profil-value">Maximilianstr. 42, 80539 München</span>
          </div>

          <div className="profil-row">
            <span className="profil-key">Telefon</span>
            <span className="profil-value">+49 176 •••••••789</span>
          </div>

          <div className="profil-row">
            <span className="profil-key">E-Mail</span>
            <span className="profil-value">t.mueller@email.de</span>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button className="btn-secondary">Daten ändern</button>
          </div>
        </div>

        <div className="profil-section">
          <div className="profil-section-title">Sicherheit & Verfahren</div>

          {/* Toggle 1: SpardaSecureGo+ */}
          <div className="security-item" style={{ opacity: updatingField === 'secureGo' ? 0.6 : 1 }}>
            <div>
              <div className="security-name">SpardaSecureGo+</div>
              <div className="security-desc">iPhone 14 Pro · Aktiviert seit 06.03.2026</div>
            </div>
            <div
              className={`toggle ${secureGo ? 'on' : ''} ${updatingField === 'secureGo' ? 'disabled' : ''}`}
              onClick={() => updatingField !== 'secureGo' && handleSecurityToggle('secureGo', secureGo, setSecureGo)}
            ></div>
          </div>

          {/* Toggle 2: Sm@rtTAN plus */}
          <div className="security-item" style={{ opacity: updatingField === 'smartTan' ? 0.6 : 1 }}>
            <div>
              <div className="security-name">Sm@rtTAN plus</div>
              <div className="security-desc">Backup-Verfahren mit TAN-Generator</div>
            </div>
            <div
              className={`toggle ${smartTan ? 'on' : ''} ${updatingField === 'smartTan' ? 'disabled' : ''}`}
              onClick={() => updatingField !== 'smartTan' && handleSecurityToggle('smartTan', smartTan, setSmartTan)}
            ></div>
          </div>

          {/* Toggle 3: E-Mail Notifications */}
          <div className="security-item" style={{ opacity: updatingField === 'emailNotifications' ? 0.6 : 1 }}>
            <div>
              <div className="security-name">Benachrichtigungen per E-Mail</div>
              <div className="security-desc">Eingang neuer Dokumente</div>
            </div>
            <div
              className={`toggle ${emailNotifications ? 'on' : ''} ${updatingField === 'emailNotifications' ? 'disabled' : ''}`}
              onClick={() => updatingField !== 'emailNotifications' && handleSecurityToggle('emailNotifications', emailNotifications, setEmailNotifications)}
            ></div>
          </div>

          {/* Toggle 4: Push Notifications */}
          <div className="security-item" style={{ opacity: updatingField === 'pushNotifications' ? 0.6 : 1 }}>
            <div>
              <div className="security-name">Push-Benachrichtigungen</div>
              <div className="security-desc">Umsätze und Überweisungen</div>
            </div>
            <div
              className={`toggle ${pushNotifications ? 'on' : ''} ${updatingField === 'pushNotifications' ? 'disabled' : ''}`}
              onClick={() => updatingField !== 'pushNotifications' && handleSecurityToggle('pushNotifications', pushNotifications, setPushNotifications)}
            ></div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <button className="btn-secondary">PIN ändern</button>
            <button className="btn-secondary">Alias ändern</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profil;
