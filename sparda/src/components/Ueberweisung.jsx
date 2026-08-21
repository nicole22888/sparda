import React, { useState, useEffect } from 'react';
import SecureGoModal from './SecureGoModal';

// ─── ACCEPT INJECTED USER AND ACCOUNTS PROPS FROM DATABASE ───
function Ueberweisung({ goTo, user, accounts = [] }) {
  // Extract primary account or fallback safely to first item
  const defaultAccount = accounts.length > 0 ? accounts[0] : null;

  // ─── STATE INITIALIZATION ───
  const [selectedAccountId, setSelectedAccountId] = useState(defaultAccount?.id || '');
  const [recipientName, setRecipientName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [amount, setAmount] = useState('');
  
  // Dynamically default execution date to today's date (YYYY-MM-DD)
  const [executionDate, setExecutionDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [purpose, setPurpose] = useState('');

  // UI state managers for interactive simulation mechanics
  const [showSecureGo, setShowSecureGo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Synchronize initial account selection when accounts prop updates asynchronously
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  // ─── STRICT DATABASE BINDINGS ───
  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim().toUpperCase();

  // Helper to dynamically format currency for option dropdowns
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '0,00 €';
    return val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  };

  // ─── SECURE BACKEND TRANSACTION LOOP ───
  const handleConfirm = async (modalCode) => {
    if (!modalCode || modalCode.trim().length < 1) return;
    
    setShowSecureGo(false);
    setIsSubmitting(true);
    setError('');

    // Construct a unique tracking signature string for the transaction ledger
    const simulatedTrackingNumber = 'SP-TX-' + Math.floor(100000 + Math.random() * 900000) + '-DE';

    try {
// Dispatch form properties directly to Express API endpoint
const response = await fetch('/api/v1/transfers', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
trackingNumber: simulatedTrackingNumber,
accountId: selectedAccountId,
recipientName: recipientName,
recipientIban: iban,
recipientBic: bic,
amount: parseFloat(amount),
executionDate: executionDate,
purpose: purpose,
senderName: fullName,
transaction_pin: modalCode
})
});

      if (!response.ok) {
        throw new Error('Server returned an unprocessable status loop boundary entry.');
      }

      // Chain reaction navigation trigger: Route user to the Postfach/Viewer view with tracking parameter
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

        {/* ─── ⚡ SERVER EXCEPTION ERROR BANNER ─── */}
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
                {/* ⚡ DYNAMIC ACCOUNT DROPDOWN ─── */}
                <select 
                  value={selectedAccountId} 
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  disabled={isSubmitting}
                >
                  {accounts.length > 0 ? (
                    accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name || 'Girokonto'} · {acc.iban || '—'} · {formatCurrency(acc.balance)}
                      </option>
                    ))
                  ) : (
                    <option value="">Keine Konten verfügbar</option>
                  )}
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
                  placeholder="z.B. Rechnung Nr. 2026-001 · max. 140 Zeichen"
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
        onClose={() => setShowSecureGo(false)}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
        user={user}
      />
    </>
  );
}

export default Ueberweisung;
