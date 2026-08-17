import React, { useState } from 'react';

function Profil() {
const [secureGo, setSecureGo] = useState(true);
const [smartTan, setSmartTan] = useState(true);
const [emailNotifications, setEmailNotifications] = useState(true);
const [pushNotifications, setPushNotifications] = useState(true);

return (
<section className="page active" id="page-profil">
<div className="page-header">
<div className="page-title">Profil & Sicherheit</div>
<div className="page-subtitle">Kundennummer: 123456 · Mitglied seit 2011</div>
</div>

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

<div className="security-item">
<div>
<div className="security-name">SpardaSecureGo+</div>
<div className="security-desc">iPhone 14 Pro · Aktiviert seit 06.03.2026</div>
</div>

<div
className={`toggle ${secureGo ? 'on' : ''}`}
onClick={() => setSecureGo(!secureGo)}
></div>
</div>

<div className="security-item">
<div>
<div className="security-name">Sm@rtTAN plus</div>
<div className="security-desc">Backup-Verfahren mit TAN-Generator</div>
</div>

<div
className={`toggle ${smartTan ? 'on' : ''}`}
onClick={() => setSmartTan(!smartTan)}
></div>
</div>

<div className="security-item">
<div>
<div className="security-name">Benachrichtigungen per E-Mail</div>
<div className="security-desc">Eingang neuer Dokumente</div>
</div>

<div
className={`toggle ${emailNotifications ? 'on' : ''}`}
onClick={() => setEmailNotifications(!emailNotifications)}
></div>
</div>

<div className="security-item">
<div>
<div className="security-name">Push-Benachrichtigungen</div>
<div className="security-desc">Umsätze und Überweisungen</div>
</div>

<div
className={`toggle ${pushNotifications ? 'on' : ''}`}
onClick={() => setPushNotifications(!pushNotifications)}
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
