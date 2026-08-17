import { useState } from 'react';

export default function PageEinstellungen() {
  const [profile, setProfile] = useState({
    name: 'Max Mustermann',
    email: 'm.mustermann@example.com',
    phone: '+49 170 1234567',
    address: 'Musterstraße 12, 80331 München'
  });

  const [security, setSecurity] = useState({
    tanMethod: 'SpardaSecureGo+',
    pushNotifications: true,
    emailAlerts: false,
    biometricLogin: true
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="page-einstellungen" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0a192f' }}>Sicherheit & Einstellungen</h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Verwalten Sie Ihre persönlichen Daten, Sicherheitsfreigaben und Benachrichtigungen.
        </p>
      </div>

      {savedMessage && (
        <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #bbf7d0', fontSize: '0.9rem' }}>
          ✓ Ihre Einstellungen wurden erfolgreich gespeichert.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Personal Details */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#003A70', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            Persönliche Daten
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#334155' }}>Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#334155' }}>E-Mail-Adresse</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#334155' }}>Meldeadresse</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        {/* Security & TAN Method */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#003A70', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            Sicherheitsverfahren & Freigabe
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.4rem', color: '#334155' }}>
              Bevorzugtes TAN-Verfahren
            </label>
            <select
              value={security.tanMethod}
              onChange={(e) => setSecurity({ ...security, tanMethod: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#f8fafc' }}
            >
              <option value="SpardaSecureGo+">SpardaSecureGo+ (App-Freigabe)</option>
              <option value="SmarTAN">SmarTAN optic (mit TAN-Generator)</option>
              <option value="mobileTAN">mobileTAN (SMS-Verfahren)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justify: 'space-between', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
              <span>Biometrisches Login aktivieren (FaceID / Fingerprint)</span>
              <input
                type="checkbox"
                checked={security.biometricLogin}
                onChange={(e) => setSecurity({ ...security, biometricLogin: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justify: 'space-between', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
              <span>Push-Benachrichtigung bei Kontobewegungen</span>
              <input
                type="checkbox"
                checked={security.pushNotifications}
                onChange={(e) => setSecurity({ ...security, pushNotifications: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justify: 'space-between', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
              <span>E-Mail-Benachrichtigung bei neuen Postfach-Dokumenten</span>
              <input
                type="checkbox"
                checked={security.emailAlerts}
                onChange={(e) => setSecurity({ ...security, emailAlerts: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => alert('PIN-Änderungsformular wird aufgerufen.')}
            style={{ padding: '0.75rem 1.25rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', color: '#dc2626' }}
          >
            Online-Banking PIN ändern
          </button>

          <button
            type="submit"
            style={{ padding: '0.75rem 1.75rem', border: 'none', backgroundColor: '#003A70', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
          >
            Änderungen Speichern
          </button>
        </div>
      </form>
    </div>
  );
}
