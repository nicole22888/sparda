import React, { useState } from 'react';

function Karten() {
const [contactless, setContactless] = useState(true);
const [onlinePayments, setOnlinePayments] = useState(true);
const [foreignPayments, setForeignPayments] = useState(true);

return (
<section className="page active" id="page-karten">
<div className="page-header">
<div className="page-title">Meine Karten</div>
<div className="page-subtitle">2 aktive Karten</div>
</div>

<div className="cards-grid">

<div>
<div className="payment-card girocard">
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
<div className="card-chip">💳</div>
<div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.8 }}>Girocard</div>
</div>

<div className="card-number">•••• •••• •••• 4782</div>

<div className="card-bottom">
<div>
<div className="card-holder-label">Karteninhaber</div>
<div className="card-holder-name">THOMAS MÜLLER</div>
</div>

<div className="card-expiry">
<div className="card-expiry-label">Gültig bis</div>
<div className="card-expiry-value">12/28</div>
</div>
</div>
</div>

<div className="card-info-row" style={{ marginTop: '12px' }}>
<div className="card-info-item">
<div className="card-info-label">Status</div>
<div className="card-info-value" style={{ color: 'var(--green)' }}>✓ Aktiv</div>
</div>

<div className="card-info-item">
<div className="card-info-label">Tageslimit</div>
<div className="card-info-value">1.500,00 €</div>
</div>

<div className="card-info-item">
<div className="card-info-label">Kontaktlos</div>
<div className="card-info-value">Aktiviert</div>
</div>

<div className="card-info-item">
<div className="card-info-label">Apple/Google Pay</div>
<div className="card-info-value">Aktiviert</div>
</div>
</div>
</div>

<div>
<div className="payment-card mastercard">
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
<div className="card-chip">💳</div>
<div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.8 }}>Mastercard Gold</div>
</div>

<div className="card-number">•••• •••• •••• 9341</div>

<div className="card-bottom">
<div>
<div className="card-holder-label">Karteninhaber</div>
<div className="card-holder-name">THOMAS MÜLLER</div>
</div>

<div className="card-expiry">
<div className="card-expiry-label">Gültig bis</div>
<div className="card-expiry-value">08/27</div>
</div>
</div>
</div>

<div className="card-info-row" style={{ marginTop: '12px' }}>
<div className="card-info-item">
<div className="card-info-label">Status</div>
<div className="card-info-value" style={{ color: 'var(--green)' }}>✓ Aktiv</div>
</div>

<div className="card-info-item">
<div className="card-info-label">Kreditlimit</div>
<div className="card-info-value">5.000,00 €</div>
</div>

<div className="card-info-item">
<div className="card-info-label">Aktuell genutzt</div>
<div className="card-info-value">342,80 €</div>
</div>

<div className="card-info-item">
<div className="card-info-label">Online-Zahlung</div>
<div className="card-info-value">Aktiviert</div>
</div>
</div>
</div>

</div>

<div className="card" style={{ padding: '20px' }}>
<div className="card-title" style={{ marginBottom: '14px' }}>
Karten-Einstellungen
</div>

<div className="security-item">
<div>
<div className="security-name">Kontaktlose Zahlung (Girocard)</div>
<div className="security-desc">NFC-Zahlungen bis 50 € ohne PIN</div>
</div>

<div
className={`toggle ${contactless ? 'on' : ''}`}
onClick={() => setContactless(!contactless)}
></div>
</div>

<div className="security-item">
<div>
<div className="security-name">Online-Zahlungen (Mastercard)</div>
<div className="security-desc">3D Secure aktiviert</div>
</div>

<div
className={`toggle ${onlinePayments ? 'on' : ''}`}
onClick={() => setOnlinePayments(!onlinePayments)}
></div>
</div>

<div className="security-item">
<div>
<div className="security-name">Auslandszahlungen</div>
<div className="security-desc">Zahlungen außerhalb EU/EWR</div>
</div>

<div
className={`toggle ${foreignPayments ? 'on' : ''}`}
onClick={() => setForeignPayments(!foreignPayments)}
></div>
</div>

</div>
</section>
);
}

export default Karten;
