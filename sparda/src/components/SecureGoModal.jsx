import { useState, useEffect } from 'react';

export default function SecureGoModal({ transactionData, onClose, onSuccess }) {
  const [status, setStatus] = useState('waiting'); // 'waiting' | 'approved' | 'cancelled'
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (countdown > 0 && status === 'waiting') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, status]);

  const handleSimulateAppApprove = () => {
    setStatus('approved');
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1500);
  };

  const handleCancel = () => {
    setStatus('cancelled');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  if (!transactionData) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 25, 47, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{ backgroundColor: '#003A70', padding: '1.25rem', color: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '0.2rem' }}>
            Sicherheitsfreigabe
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>SpardaSecureGo+</h2>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {status === 'waiting' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  margin: '0 auto 1rem auto'
                }}>
                  📲
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Freigabe in der App erforderlich</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Bitte öffnen Sie Ihre <strong>SpardaSecureGo+ App</strong> auf Ihrem Mobilgerät und bestätigen Sie die Transaktion.
                </p>
              </div>

              {/* Transaction Details Box */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Empfänger:</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{transactionData.recipient}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>IBAN:</span>
                  <span style={{ fontFamily: 'monospace', color: '#0f172a' }}>{transactionData.iban}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Verwendungszweck:</span>
                  <span style={{ color: '#0f172a' }}>{transactionData.reference}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontWeight: 'bold' }}>Betrag:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#003A70' }}>{transactionData.amount} €</span>
                </div>
              </div>

              {/* Timer & Dev Simulation Shortcut */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Verbleibende Zeit: <strong style={{ color: '#475569' }}>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={handleSimulateAppApprove}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#00875A', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  ✓ App-Bestätigung simulieren
                </button>
                <button
                  onClick={handleCancel}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: 'transparent', color: '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Vorgang abbrechen
                </button>
              </div>
            </>
          )}

          {status === 'approved' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#00875A' }}>Freigabe erfolgreich!</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Ihre Überweisung wurde ausgeführt.</p>
            </div>
          )}

          {status === 'cancelled' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>❌</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>Vorgang abgebrochen</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Es wurde keine Buchung durchgeführt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
