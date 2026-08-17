import { useState } from 'react';

export default function PageUeberweisung({ onTriggerSecureGo }) {
  const [recipient, setRecipient] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [selectedSource, setSelectedSource] = useState('giro');
  const [executionDate, setExecutionDate] = useState('sofort');
  const [customDate, setCustomDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipient || !iban || !amount) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    // Trigger the SpardaSecureGo+ Modal
    if (onTriggerSecureGo) {
      onTriggerSecureGo({
        recipient,
        iban,
        amount,
        reference: reference || 'Überweisung'
      });
    } else {
      alert('Freigabe via SpardaSecureGo+ gestartet.');
    }
  };

  return (
    <div className="page-ueberweisung" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0a192f' }}>Inlands- & SEPA-Überweisung</h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Führen Sie Überweisungen einfach und sicher mit SpardaSecureGo+ aus.
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <form onSubmit={handleSubmit}>
          {/* Source Account Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1e293b' }}>
              Absenderkonto *
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', backgroundColor: '#f8fafc' }}
            >
              <option value="giro">SpardaGiro Classic — DE89 3006 0010 0001 2345 67 (14.852,30 €)</option>
              <option value="flex">SpardaSpar Flex — DE42 3006 0010 0002 9876 54 (32.400,00 €)</option>
            </select>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1.5rem 0' }} />

          {/* Recipient Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                Empfänger Name / Firma *
              </label>
              <input
                type="text"
                placeholder="z. B. Max Mustermann"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                IBAN *
              </label>
              <input
                type="text"
                placeholder="DE89 0000 0000 0000 0000 00"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                BIC / SWIFT (Optional)
              </label>
              <input
                type="text"
                placeholder="GENODEF1SPD"
                value={bic}
                onChange={(e) => setBic(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          {/* Payment Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                Betrag (€) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 'bold' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                Verwendungszweck
              </label>
              <input
                type="text"
                placeholder="z. B. Rechnungsnummer 4092"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                maxLength={140}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          {/* Execution Timing */}
          <div style={{ marginBottom: '1.75rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569', textTransform: 'uppercase' }}>
              Ausführungsdatum
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="execution"
                  value="sofort"
                  checked={executionDate === 'sofort'}
                  onChange={() => setExecutionDate('sofort')}
                />
                Sofort ausführen
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="execution"
                  value="termin"
                  checked={executionDate === 'termin'}
                  onChange={() => setExecutionDate('termin')}
                />
                Terminüberweisung
              </label>
              {executionDate === 'termin' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  style={{ padding: '0.4rem 0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => { setRecipient(''); setIban(''); setAmount(''); setReference(''); }}
              style={{ padding: '0.75rem 1.25rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', color: '#475569' }}
            >
              Zurücksetzen
            </button>
            <button
              type="submit"
              style={{ padding: '0.75rem 1.75rem', border: 'none', backgroundColor: '#003A70', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
            >
              Weiter zur Freigabe →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
