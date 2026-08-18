import React, { useState, useEffect } from 'react';

function Karten() {
  // ─── ⚡ NEW: LIVE TOGGLE STATE HANDLERS ───
  const [contactless, setContactless] = useState(true);
  const [onlinePayments, setOnlinePayments] = useState(true);
  const [foreignPayments, setForeignPayments] = useState(true);

  // Operational states for backend synchronization hooks
  const [updatingField, setUpdatingField] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ─── ⚡ NEW: INITIAL FETCH LOGIC FROM SERVER SOURCE OF TRUTH ───
  useEffect(() => {
    const fetchCardSettings = async () => {
      try {
        const response = await fetch('/api/v1/cards/settings');
        const data = await response.json();
        
        if (data && data.success) {
          setContactless(data.settings.contactless);
          setOnlinePayments(data.settings.onlinePayments);
          setForeignPayments(data.settings.foreignPayments);
        }
      } catch (err) {
        console.error("SANTOS CORE ENGINE // Card configuration query failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardSettings();
  }, []);

  // ─── ⚡ NEW: ASYNCHRONOUS SECURITY OVERRIDE HANDLER ───
  const handleSettingToggle = async (settingName, currentValue, setterFunction) => {
    const newValue = !currentValue;
    setUpdatingField(settingName);
    setError('');

    try {
      // Optimistically update frontend state for snappy visual feedback
      setterFunction(newValue);

      // Dispatch state update payload to your Express backend framework
      const response = await fetch('/api/v1/cards/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: settingName, value: newValue })
      });

      if (!response.ok) {
        throw new Error('Database patch rejected.');
      }

      console.log(`SANTOS CORE ENGINE // Card configuration synced: ${settingName} ->`, newValue);

    } catch (err) {
      console.error('CRITICAL RECONCILIATION ERROR // Rolling back input layout layer:', err);
      // Fallback: Revert state parameters back to historical data on connection dropout
      setterFunction(currentValue);
      setError('Verbindung fehlgeschlagen. Einstellung konnte nicht gespeichert werden.');
    } finally {
      setUpdatingField(null);
    }
  };

  return (
    <section className="page active" id="page-karten">
      <div className="page-header">
        <div className="page-title">Meine Karten</div>
        <div className="page-subtitle">2 aktive Karten</div>
      </div>

      {/* ─── ⚡ NEW: COMPLIANCE EXCEPTION BANNER ─── */}
      {error && (
        <div style={{ color: 'var(--red)', padding: '12px', background: '#fef2f2', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)' }}>
          ⌛ Karteneinstellungen werden geladen...
        </div>
      ) : (
        <>
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

                {/* ⚡ FIXED: Dynamic mapping targeting active state hook arrays */}
                <div className="card-info-item">
                  <div className="card-info-label">Kontaktlos</div>
                  <div className="card-info-value" style={{ color: contactless ? 'var(--green)' : 'var(--gray-500)' }}>
                    {contactless ? 'Aktiviert' : 'Deaktiviert'}
                  </div>
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

                {/* ⚡ FIXED: Dynamic mapping targeting active state hook arrays */}
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
            <div className="security-item" style={{ opacity: updatingField === 'onlinePayments' ? 0.6 : 1 }}>
              <div>
                <div className="security-name">Online-Zahlungen (Mastercard)</div>
                <div className="security-desc">3D Secure aktiviert</div>
              </div>
              <div
                className={`toggle ${onlinePayments ? 'on' : ''} ${updatingField === 'onlinePayments' ? 'disabled' : ''}`}
                onClick={() => updatingField !== 'onlinePayments' && handleSettingToggle('onlinePayments', onlinePayments, setOnlinePayments)}
              ></div>
            </div>

            {/* Toggle 3: Auslandszahlungen */}
            <div className="security-item" style={{ opacity: updatingField === 'foreignPayments' ? 0.6 : 1 }}>
              <div>
                <div className="security-name">Auslandszahlungen</div>
                <div className="security-desc">Zahlungen außerhalb EU/EWR</div>
              </div>
              <div
                className={`toggle ${foreignPayments ? 'on' : ''} ${updatingField === 'foreignPayments' ? 'disabled' : ''}`}
                onClick={() => updatingField !== 'foreignPayments' && handleSettingToggle('foreignPayments', foreignPayments, setForeignPayments)}
              ></div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Karten;
