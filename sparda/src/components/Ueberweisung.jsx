import React, { useState } from 'react';
import SecureGoModal from './SecureGoModal';

function Ueberweisung({ goTo }) {
  // ─── ⚡ NEW: CONTROLLED FORM STATE HANDLERS ───
  const [recipientName, setRecipientName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [amount, setAmount] = useState('');
  const [executionDate, setExecutionDate] = useState('2026-08-18'); // Updated default to sync with 2026 baseline
  const [purpose, setPurpose] = useState('');

  // UI state managers for interactive simulation mechanics
  const [showSecureGo, setShowSecureGo] = useState(false);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ─── ⚡ NEW: SECURE BACKEND TRANSACTION LOOP ───
  const handleConfirm = async () => {
    if (code.length < 1) return; // Simple safeguard check
    
    setShowSecureGo(false);
    setIsSubmitting(true);
    setError('');

    // Construct a unique tracking signature string for the simulated transaction ledger
    const simulatedTrackingNumber = 'SP-TX-' + Math.floor(100000 + Math.random() * 900000) + '-DE';

    try {
      // 1. Dispatch form properties directly to your Express endpoint
      const response = await fetch('/api/v1/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf' // Connects cleanly with binary stream expectations or standard JSON API routers
        },
        body: JSON.stringify({
          trackingNumber: simulatedTrackingNumber,
          recipientName: recipientName,
          recipientIban: iban,
          recipientBic: bic,
          amount: parseFloat(amount),
          executionDate: executionDate,
          purpose: purpose,
          senderName: "THOMAS MÜLLER"
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an unprocessable status loop boundary entry.');
      }

      // 2. Clear input state arrays after successful entry execution
      setCode('');
      
      // 3. Chain reaction navigation trigger: Route the user to the Postfach/Viewer view
      // We pass the tracking ID so your iframe controller can read from the service file instantly
      goTo(`postfach?trackingNumber=${simulatedTrackingNumber}`);

    } catch (err) {
      console.error('SIMULATION DISPATCH FAILURE // State integrity maintained:', err);
      setError('Der Auftrag konnte nicht verarbeitet werden. Bitte überprüfen Sie Ihre Netzwerkverbindung.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="page active" id="page-überweisung">
        <div className="page-header">
          <div className="page-title">
            SEPA-Überweisung
          </div>
          <div className="page-subtitle">
            Überweisungen werden mit SpardaSecureGo+ freigegeben
          </div>
        </div>

        {/* ─── ⚡ NEW: SERVER EXCEPTION ERROR BANNER ─── */}
        {error && (
          <div style={{ color: 'var(--red)', padding: '12px', background: '#fef2f2', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="securego-note">
          <span className="securego-note-icon">
            🔒
          </span>
          <div>
            <strong style={{ display: 'block', marginBottom: '3px' }}>
              SpardaSecureGo+ Freigabe erforderlich
            </strong>
            Jede Überweisung muss über die SpardaSecureGo+ App auf Ihrem Smartphone bestätigt werden. Sie erhalten eine Push-Benachrichtigung nach dem Abschicken.
          </div>
        </div>

        <div className="transfer-form">
          <div className="form-section">
            <div className="form-section-title">
              Auftraggeber
            </div>
            <div className="form-grid">
              <div className="field-group full">
                <label>
                  Konto
                </label>
                <select defaultValue="giro">
                  <option value="giro">
                    SpardaGiro Klassik · DE89 7009 0500 0012 3456 78 · 2.847,93 €
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              Empfänger
            </div>
            <div className="form-grid">
              <div className="field-group full">
                <label>
                  Name des Empfängers *
                </label>
                <input
                  type="text"
                  placeholder="Vor- und Nachname / Firmenname"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="field-group full">
                <label>
                  IBAN *
                </label>
                <input
                  type="text"
                  placeholder="DE00 0000 0000 0000 0000 00"
                  style={{ fontFamily: 'monospace' }}
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="field-group">
                <label>
                  BIC (optional)
                </label>
                <input
                  type="text"
                  placeholder="z.B. SSKMDEMMXXX"
                  value={bic}
                  onChange={(e) => setBic(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="field-group">
                <label>
                  Bank
                </label>
                <input
                  type="text"
                  placeholder="Wird automatisch ermittelt"
                  readOnly
                  style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              Auftragsdetails
            </div>
            <div className="form-grid">
              <div className="field-group">
                <label>
                  Betrag (EUR) *
                </label>
                <input
                  type="number"
                  placeholder="0,00"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="field-group">
                <label>
                  Ausführungsdatum
                </label>
                <input
                  type="date"
                  value={executionDate}
                  onChange={(e) => setExecutionDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="field-group full">
                <label>
                  Verwendungszweck
                </label>
                <textarea
                  placeholder="z.B. Rechnung Nr. 2024-001 · max. 140 Zeichen"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => !isSubmitting && setShowSecureGo(true)}
              disabled={isSubmitting || !recipientName || !iban || !amount}
            >
              {isSubmitting ? '⌛ Wird verarbeitet...' : '✓ Weiter zur Freigabe'}
            </button>
            <button className="btn-secondary" disabled={isSubmitting}>
              Speichern als Vorlage
            </button>
          </div>
        </div>
      </section>
      <SecureGoModal
    isOpen={showSecureGo}
    onClose={() => {
    setCode('');
    setShowSecureGo(false);
    }}
    onConfirm={handleConfirm}
    isSubmitting={isSubmitting}
   />
  </>
  );
}

export default Ueberweisung;
