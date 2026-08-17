import React, { useState } from 'react';

function Ueberweisung({ goTo }) {
const [showSecureGo, setShowSecureGo] = useState(false);
const [code, setCode] = useState('');

const handleConfirm = () => {
setShowSecureGo(false);

if (code.length >= 1) {
setTimeout(() => {
alert(
'✅ Auftrag erfolgreich erteilt!\n\nIhre Überweisung wurde mit SpardaSecureGo+ freigegeben und wird verarbeitet.'
);
}, 100);
}
  
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


<div className="securego-note">

<span className="securego-note-icon">
🔒
</span>

<div>

<strong
style={{
display: 'block',
marginBottom: '3px'
}}
>
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
/>

</div>


<div className="field-group full">

<label>
IBAN *
</label>

<input
type="text"
placeholder="DE00 0000 0000 0000 0000 00"
style={{
fontFamily: 'monospace'
}}
/>

</div>


<div className="field-group">

<label>
BIC (optional)
</label>

<input
type="text"
placeholder="z.B. SSKMDEMMXXX"
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
style={{
background: 'var(--gray-50)',
color: 'var(--gray-500)'
}}
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
/>

</div>


<div className="field-group">

<label>
Ausführungsdatum
</label>

<input
type="date"
defaultValue="2026-03-09"
/>

</div>


<div className="field-group full">

<label>
Verwendungszweck
</label>

<textarea
placeholder="z.B. Rechnung Nr. 2024-001 · max. 140 Zeichen"
/>

</div>

</div>

</div>


<div
style={{
display: 'flex',
gap: '12px',
alignItems: 'center'
}}
>

<button
className="btn-primary"
onClick={() => setShowSecureGo(true)}
>
✓ Weiter zur Freigabe
</button>

<button className="btn-secondary">
Speichern als Vorlage
</button>

</div>

</div>

</section>


{showSecureGo && (

<div
className="modal-overlay show"
id="securego-modal"
>

<div className="modal-box">

<div className="modal-icon">
📱
</div>

<h3>
SpardaSecureGo+ Freigabe
</h3>

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
onChange={(event) => setCode(event.target.value)}
/>


<div className="modal-actions">

<button
className="btn-primary"
onClick={handleConfirm}
>
✓ Bestätigen
</button>

<button
className="btn-secondary"
onClick={() => setShowSecureGo(false)}
>
Abbrechen
</button>

</div>

</div>

</div>

)}

</>
);
}
}
export default Ueberweisung;