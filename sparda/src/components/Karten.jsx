import React, { useState, useEffect } from 'react';

// ─── ⚡ DYNAMIC: ACCEPT INJECTED USER PROP FROM THE SOURCE OF TRUTH ───
function Karten({ user }) {
  // ─── ⚡ PURE DYNAMIC: NO HARDCODED FALLBACKS ───
  const [cards, setCards] = useState([]);
  const [contactless, setContactless] = useState(false);
  const [onlinePayments, setOnlinePayments] = useState(false);
  const [foreignPayments, setForeignPayments] = useState(false);

  // Operational states for backend synchronization hooks
  const [updatingField, setUpdatingField] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        // Querying a consolidated endpoint for both card details and security settings
        const response = await fetch('/api/v1/cards/data');
        const data = await response.json();
        
        if (data && data.success) {
          setCards(data.cards || []);
          setContactless(data.settings?.contactless ?? false);
          setOnlinePayments(data.settings?.onlinePayments ?? false);
          setForeignPayments(data.settings?.foreignPayments ?? false);
        }
      } catch (err) {
        console.error("SANTOS CORE ENGINE // Card configuration query failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardData();
  }, []);

  const handleSettingToggle = async (settingName, currentValue, setterFunction) => {
    const newValue = !currentValue;
    setUpdatingField(settingName);
    setError('');

    try {
      setterFunction(newValue);

      const response = await fetch('/api/v1/cards/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: settingName, value: newValue })
      });

      if (!response.ok) {
        throw new Error('Database patch rejected.');
      }

    } catch (err) {
      console.error('CRITICAL RECONCILIATION ERROR // Rolling back input layout layer:', err);
      setterFunction(currentValue);
      setError('Verbindung fehlgeschlagen. Einstellung konnte nicht gespeichert werden.');
    } finally {
      setUpdatingField(null);
    }
  };

  // ─── STRICT DATABASE BINDINGS ───
  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim().toUpperCase();

  const giro = cards.find(c => c.card_type?.toLowerCase() === 'girocard') || {};
    const master = cards.find(c => c.card_type?.toLowerCase() === 'mastercard') || {};

  // Helper to dynamically format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <section className="page active" id="page-karten">
      <div className="page-header">
        <div className="page-title">Meine Karten</div>
        {/* ─── ⚡ DYNAMIC: CARD COUNT ─── */}
        <div className="page-subtitle">{cards.length || 0} aktive Karten</div>
      </div>

      {error && (
        <div style={{ color: 'var(--red)', padding: '12px', background: '#fef2f2', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)' }}>
          ⌛ Kartendaten werden geladen...
        </div>
      ) : (
        <>
          <div className="cards-grid">
            <div>
              <div className="payment-card girocard">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="card-chip">💳</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.8 }}>
                    {giro.card_name || '-'}
                  </div>
                </div>

                <div className="card-number">{giro.masked_number || '•••• •••• •••• ••••'}</div>

                <div className="card-bottom">
                  <div>
                    <div className="card-holder-label">Karteninhaber</div>
                    <div className="card-holder-name">{fullName || '-'}</div>
                  </div>

                  <div className="card-expiry">
                    <div className="card-expiry-label">Gültig bis</div>
                    <div className="card-expiry-value">{giro.expiry_date || '-/-'}</div>
                  </div>
                </div>
              </div>

              <div className="card-info-row" style={{ marginTop: '12px' }}>
                <div className="card-info-item">
                  <div className="card-info-label">Status</div>
                  <div className="card-info-value" style={{ color: giro.status === 'active' ? 'var(--green)' : 'inherit' }}>
                    {giro.status === 'active' ? '✓ Aktiv' : (giro.status || '-')}
                  </div>
                </div>

                <div className="card-info-item">
                  <div className="card-info-label">Tageslimit</div>
                  <div className="card-info-value">{formatCurrency(giro.daily_limit)}</div>
                </div>

                <div className="card-info-item">
                  <div className="card-info-label">Kontaktlos</div>
                  <div className="card-info-value" style={{ color: contactless ? 'var(--green)' : 'var(--gray-500)' }}>
                    {contactless ? 'Aktiviert' : 'Deaktiviert'}
                  </div>
                </div>

                <div className="card-info-item">
                  <div className="card-info-label">Apple/Google Pay</div>
                  <div className="card-info-value">
                    {giro.mobile_pay_active ? 'Aktiviert' : 'Deaktiviert'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="payment-card mastercard">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="card-chip">💳</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.8 }}>
                    {master.card_name || '-'}
                  </div>
                </div>

                <div className="card-number">{master.masked_number || '•••• •••• •••• ••••'}</div>

                <div className="card-bottom">
                  <div>
                    <div className="card-holder-label">Karteninhaber</div>
                    <div className="card-holder-name">{fullName || '-'}</div>
                  </div>

                  <div className="card-expiry">
                    <div className="card-expiry-label">Gültig bis</div>
                    <div className="card-expiry-value">{master.expiry_date || '-/-'}</div>
                  </div>
                </div>
              </div>

              <div className="card-info-row" style={{ marginTop: '12px' }}>
                <div className="card-info-item">
                  <div className="card-info-label">Status</div>
                  <div className="card-info-value" style={{ color: master.status === 'active' ? 'var(--green)' : 'inherit' }}>
                    {master.status === 'active' ? '✓ Aktiv' : (master.status || '-')}
                  </div>
                </div>

                <div className="card-info-item">
                  <div className="card-info-label">Kreditlimit</div>
                  <div className="card-info-value">{formatCurrency(master.credit_limit)}</div>
                </div>

                <div className="card-info-item">
                  <div className="card-info-label">Aktuell genutzt</div>
                  <div className="card-info-value">{formatCurrency(master.used_amount)}</div>
                </div>

                <div className="card-info-item">
                  <div className="card-info-label">Online-Zahlung</div>
                  <div className="card-info-value" style={{ color: onlinePayments ? 'var(--green)' : 'var(--gray-500)' }}>
                    {onlinePayments ? 'Aktiviert' : 'Deaktiviert'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div className="card-title" style={{ marginBottom: '14px' }}>
              Karten-Einstellungen
            </div>
{/* Toggle 1: Kontaktlose Zahlung */}
<div className="security-item" style={{ opacity: updatingField === 'contactless' ? 0.6 : 1 }}>
<div>
<div className="security-name">Kontaktlose Zahlung (Girocard)</div>
<div className="security-desc">NFC-Zahlungen bis 50 € ohne PIN</div>
</div>
<div
className={`toggle ${contactless ? 'on' : ''} ${updatingField === 'contactless' ? 'disabled' : ''}`}
onClick={() => updatingField !== 'contactless' && handleSettingToggle('contactless', contactless, setContactless)}
></div>
</div>

{/* Toggle 2: Online-Zahlungen */}
<div className="security-item" style={{ opacity: updatingField === 'online_payments' ? 0.6 : 1 }}>
<div>
<div className="security-name">Online-Zahlungen (Mastercard)</div>
<div className="security-desc">3D Secure aktiviert</div>
</div>
<div
className={`toggle ${onlinePayments ? 'on' : ''} ${updatingField === 'online_payments' ? 'disabled' : ''}`}
onClick={() => updatingField !== 'online_payments' && handleSettingToggle('online_payments', onlinePayments, setOnlinePayments)}
></div>
</div>

{/* Toggle 3: Auslandszahlungen */}
<div className="security-item" style={{ opacity: updatingField === 'foreign_payments' ? 0.6 : 1 }}>
<div>
<div className="security-name">Auslandszahlungen</div>
<div className="security-desc">Zahlungen außerhalb EU/EWR</div>
</div>
<div
className={`toggle ${foreignPayments ? 'on' : ''} ${updatingField === 'foreign_payments' ? 'disabled' : ''}`}
onClick={() => updatingField !== 'foreign_payments' && handleSettingToggle('foreign_payments', foreignPayments, setForeignPayments)}
></div>
</div>
</div>
</>
)}
</section>
);
}

export default Karten;
