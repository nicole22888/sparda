import React, { useState } from 'react';

// ─── DYNAMIC: ACCEPT INJECTED USER PROP FROM THE DATABASE ───
function SecureGoModal({ isOpen, onClose, onConfirm, isSubmitting = false, user }) {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const confirmTransfer = () => {
    //SEPARATION OF CONCERNS: Pass the collected PIN up to the file executing the database save
    if (code.trim().length >= 1 && onConfirm) {
      onConfirm(code);
    }
  };

  // ─── ⚡ STRICT DATABASE BINDING FOR DEVICE NAME ───
  // Completely dynamic: pulls whatever device is tied to the user's database row
  const deviceName = user?.device_name || user?.securego_device || '';

  return (
    <div className="modal-overlay show" id="securego-modal">
      <div className="modal-box">
        <div className="modal-icon">📱</div>

        <h3>SpardaSecureGo+ Freigabe</h3>

        <p>
          Eine Push-Benachrichtigung wurde an <strong>{deviceName}</strong> gesendet.
          <br />
          Oder geben Sie Ihren 6-stelligen Freigabecode ein:
        </p>

        <input
          className="modal-input"
          type="text"
          maxLength="6"
          placeholder="— — — — — —"
          id="modal-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={confirmTransfer}
            disabled={isSubmitting || code.trim().length === 0}
          >
            {isSubmitting ? '⌛ Wird verarbeitet...' : '✓ Bestätigen'}
          </button>

          <button
            className="btn-secondary"
            onClick={() => {
              setCode('');
              onClose();
            }}
            disabled={isSubmitting}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecureGoModal;
