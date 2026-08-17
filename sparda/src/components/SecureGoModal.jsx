import React, { useState } from 'react';

function SecureGoModal({ isOpen, onClose }) {
const [code, setCode] = useState('');

if (!isOpen) return null;

const confirmTransfer = () => {
onClose();

if (code.length >= 1) {
setTimeout(() => {
alert(
'✅ Auftrag erfolgreich erteilt!\n\nIhre Überweisung wurde mit SpardaSecureGo+ freigegeben und wird verarbeitet.'
);
}, 100);
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
/>

<div className="modal-actions">

<button
className="btn-primary"
onClick={confirmTransfer}
>
✓ Bestätigen
</button>

<button
className="btn-secondary"
onClick={onClose}
>
Abbrechen
</button>

</div>

</div>
</div>
);
}

export default SecureGoModal;
