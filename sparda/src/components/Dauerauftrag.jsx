import React from 'react';

function Dauerauftrag({ goTo }) {
return (
<section className="page active" id="page-dauerauftrag">

<div className="page-header">

<div className="page-title">
Daueraufträge
</div>

<div className="page-subtitle">
4 aktive Daueraufträge · Nächste Ausführung: 15.03.2026
</div>

</div>


<div style={{ marginBottom: '16px' }}>
<button className="btn-primary">
+ Neuer Dauerauftrag
</button>
</div>


<div className="dauerauftrag-item">

<div
className="da-icon"
style={{ background: '#fff0f0' }}
>
🏠
</div>

<div className="da-info">

<div className="da-name">
Hausverwaltung München GmbH
</div>

<div className="da-iban">
DE12 7009 0500 9988 7766 55
</div>

<div className="da-schedule">
Monatlich am 1. · Nächste: 01.04.2026 · Verwendungszweck: Miete April
</div>

</div>

<div>

<div className="da-amount">
−950,00 €
</div>

<span className="tag tag-green">
Aktiv
</span>

</div>

<div className="da-actions">

<button className="da-btn">
✏️
</button>

<button className="da-btn">
🗑️
</button>

</div>

</div>


<div className="dauerauftrag-item">

<div
className="da-icon"
style={{ background: '#f0f4ff' }}
>
📱
</div>

<div className="da-info">

<div className="da-name">
Telekom Deutschland GmbH
</div>

<div className="da-iban">
DE84 1001 0010 0556 7788 00
</div>

<div className="da-schedule">
Monatlich am 1. · Nächste: 01.04.2026 · Verwendungszweck: Kd.-Nr. 4728812
</div>

</div>

<div>

<div className="da-amount">
−39,95 €
</div>

<span className="tag tag-green">
Aktiv
</span>

</div>

<div className="da-actions">

<button className="da-btn">
✏️
</button>

<button className="da-btn">
🗑️
</button>

</div>

</div>


<div className="dauerauftrag-item">

<div
className="da-icon"
style={{ background: '#f0fff4' }}
>
💰
</div>

<div className="da-info">

<div className="da-name">
SpardaSpar Flex · Sparplan
</div>

<div className="da-iban">
DE89 7009 0500 0012 3456 90 (eigenes Konto)
</div>

<div className="da-schedule">
Monatlich am 15. · Nächste: 15.03.2026 · Verwendungszweck: Sparrate
</div>

</div>

<div>

<div className="da-amount">
−500,00 €
</div>

<span className="tag tag-green">
Aktiv
</span>

</div>

<div className="da-actions">

<button className="da-btn">
✏️
</button>

<button className="da-btn">
🗑️
</button>

</div>

</div>


<div className="dauerauftrag-item">

<div
className="da-icon"
style={{ background: '#fffbf0' }}
>
💡
</div>

<div className="da-info">

<div className="da-name">
E.ON Energie Deutschland · Abschlag
</div>

<div className="da-iban">
DE56 2004 1133 0236 4543 00
</div>

<div className="da-schedule">
Monatlich am 28. · Nächste: 28.03.2026 · Strom und Gas
</div>

</div>

<div>

<div className="da-amount">
−87,00 €
</div>

<span className="tag tag-green">
Aktiv
</span>

</div>

<div className="da-actions">

<button className="da-btn">
✏️
</button>

<button className="da-btn">
🗑️
</button>

</div>

</div>

</section>
);
}

export default Dauerauftrag;
