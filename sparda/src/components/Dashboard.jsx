import React from 'react';

function Dashboard({ goTo }) {
return (
<section className="page active" id="page-kontoübersicht">

<div className="page-header">
<div className="page-title">
Kontoübersicht
</div>

<div className="page-subtitle">
Letzter Login: Heute, 09:14 Uhr · IP: 192.168.1.xxx · Gerät: Chrome/Windows
</div>
</div>


<div className="account-cards">

<div
className="account-card giro"
onClick={() => goTo('umsätze')}
>
<div className="account-card-type">
Girokonto
</div>

<div className="account-card-name">
SpardaGiro Klassik
</div>

<div className="account-card-iban">
DE89 7009 0500 0012 3456 78
</div>

<div className="account-card-balance">
2.847,93 €
</div>

<div className="account-card-balance-label">
Verfügbares Guthaben
</div>

<div className="account-card-actions">

<button
className="card-action-btn"
onClick={(event) => {
event.stopPropagation();
goTo('überweisung');
}}
>
Überweisen
</button>

<button
className="card-action-btn"
onClick={(event) => {
event.stopPropagation();
goTo('umsätze');
}}
>
Umsätze
</button>

</div>
</div>


<div
className="account-card spar"
onClick={() => goTo('sparkonto')}
>
<div className="account-card-type">
Sparkonto
</div>

<div className="account-card-name">
SpardaSpar Flex
</div>

<div className="account-card-iban">
DE89 7009 0500 0012 3456 90
</div>

<div className="account-card-balance">
15.240,00 €
</div>

<div className="account-card-balance-label">
Guthaben (2,5 % p.a.)
</div>

<div className="account-card-actions">

<button
className="card-action-btn"
onClick={(event) => {
event.stopPropagation();
goTo('sparkonto');
}}
>
Details
</button>

</div>
</div>


<div
className="account-card depot"
onClick={() => goTo('depot')}
>
<div className="account-card-type">
Depot · UnionInvest
</div>

<div className="account-card-name">
UnionDepot
</div>

<div className="account-card-iban">
Depot-Nr: 4821 0076 00
</div>

<div className="account-card-balance">
38.412,75 €
</div>

<div className="account-card-balance-label">
Depotwert ▲ +4,8 % YTD
</div>

<div className="account-card-actions">

<button
className="card-action-btn"
onClick={(event) => {
event.stopPropagation();
goTo('depot');
}}
>
Depot ansehen
</button>

</div>
</div>

</div>


<div className="stats-row">

<div className="stat-box">
<div className="stat-box-label">
Einnahmen (März)
</div>

<div className="stat-box-value positive">
+3.400,00 €
</div>

<div className="stat-box-sub">
Gehalt + Zinsen
</div>
</div>


<div className="stat-box">
<div className="stat-box-label">
Ausgaben (März)
</div>

<div className="stat-box-value negative">
-1.847,22 €
</div>

<div className="stat-box-sub">
inkl. Daueraufträge
</div>
</div>


<div className="stat-box">
<div className="stat-box-label">
Gesamt Guthaben
</div>

<div className="stat-box-value">
56.500,68 €
</div>

<div className="stat-box-sub">
Alle Konten
</div>
</div>


<div className="stat-box">
<div className="stat-box-label">
Daueraufträge
</div>

<div className="stat-box-value">
4 aktiv
</div>

<div className="stat-box-sub">
Nächste am 15.03.
</div>
</div>

</div>


<div className="content-grid">

<div>

<div className="card">

<div className="card-header">

<span className="card-title">
Letzte Umsätze · Girokonto
</span>

<span
className="card-link"
onClick={() => goTo('umsätze')}
>
Alle anzeigen →
</span>

</div>


<div className="card-body">

<div className="tx-item">

<div className="tx-icon income">
💰
</div>

<div className="tx-info">

<div className="tx-name">
Gehaltseingang Siemens AG
</div>

<div className="tx-detail">
Verwendungszweck: Gehalt März 2026
</div>

</div>

<div className="tx-right">

<div className="tx-amount positive">
+3.200,00 €
</div>

<div className="tx-date">
07.03.2026
</div>

</div>

</div>


<div className="tx-item">

<div className="tx-icon expense">
🛒
</div>

<div className="tx-info">

<div className="tx-name">
REWE Kaufpark München
</div>

<div className="tx-detail">
Kartenzahlung · Girocard
</div>

</div>

<div className="tx-right">

<div className="tx-amount negative">
-94,38 €
</div>

<div className="tx-date">
06.03.2026
</div>

</div>

</div>


<div className="tx-item">

<div className="tx-icon expense">
🏠
</div>

<div className="tx-info">

<div className="tx-name">
Hausverwaltung GmbH · Miete
</div>

<div className="tx-detail">
Dauerauftrag · Monatliche Miete
</div>

</div>

<div className="tx-right">

<div className="tx-amount negative">
-950,00 €
</div>

<div className="tx-date">
01.03.2026
</div>

</div>

</div>


<div className="tx-item">

<div className="tx-icon transfer">
🔁
</div>

<div className="tx-info">

<div className="tx-name">
Sparkonto Übertrag
</div>

<div className="tx-detail">
Eigene Umbuchung
</div>

</div>

<div className="tx-right">

<div className="tx-amount negative">
-500,00 €
</div>

<div className="tx-date">
01.03.2026
</div>

</div>

</div>


<div className="tx-item">

<div className="tx-icon expense">
⚡
</div>

<div className="tx-info">

<div className="tx-name">
E.ON Energie · Strom
</div>

<div className="tx-detail">
Lastschrift · Kd-Nr. 4728812
</div>

</div>

<div className="tx-right">

<div className="tx-amount negative">
-87,00 €
</div>

<div className="tx-date">
28.02.2026
</div>

</div>

</div>


<div className="tx-item">

<div className="tx-icon income">
💸
</div>

<div className="tx-info">

<div className="tx-name">
Zinsgutschrift SpardaSpar
</div>

<div className="tx-detail">
Zinsen Feb. 2026 · 2,5 % p.a.
</div>

</div>

<div className="tx-right">

<div className="tx-amount positive">
+31,75 €
</div>

<div className="tx-date">
28.02.2026
</div>

</div>

</div>


<div className="tx-item">

<div className="tx-icon expense">
🎬
</div>

<div className="tx-info">

<div className="tx-name">
Netflix International BV
</div>

<div className="tx-detail">
Lastschrift · Abo
</div>

</div>

<div className="tx-right">

<div className="tx-amount negative">
-17,99 €
</div>

<div className="tx-date">
27.02.2026
</div>

</div>

</div>


<div className="tx-item">

<div className="tx-icon expense">
🚗
</div>

<div className="tx-info">

<div className="tx-name">
Aral Tankstelle München West
</div>

<div className="tx-detail">
Kartenzahlung · Mastercard Gold
</div>

</div>

<div className="tx-right">

<div className="tx-amount negative">
-68,50 €
</div>

<div className="tx-date">
25.02.2026
</div>

</div>

</div>

</div>
</div>


<div
className="card"
style={{ marginTop: '16px' }}
>

<div className="card-header">

<span className="card-title">
Ausgaben nach Kategorien (Feb/Mär)
</span>

</div>


<div className="chart-area">

<div className="bar-chart">

<div className="bar-item">

<div
className="bar"
style={{
height: '65px',
background: 'var(--red)'
}}
></div>

<div className="bar-label">
Wohnen
</div>

</div>


<div className="bar-item">

<div
className="bar"
style={{
height: '32px',
background: 'var(--gray-400)'
}}
></div>

<div className="bar-label">
Lebensmittel
</div>

</div>


<div className="bar-item">

<div
className="bar"
style={{
height: '20px',
background: 'var(--blue)'
}}
></div>

<div className="bar-label">
Transport
</div>

</div>


<div className="bar-item">

<div
className="bar"
style={{
height: '15px',
background: 'var(--green)'
}}
></div>

<div className="bar-label">
Freizeit
</div>

</div>


<div className="bar-item">

<div
className="bar"
style={{
height: '12px',
background: '#f59e0b'
}}
></div>

<div className="bar-label">
Medien
</div>

</div>


<div className="bar-item">

<div
className="bar"
style={{
height: '18px',
background: '#8b5cf6'
}}
></div>

<div className="bar-label">
Sonstiges
</div>

</div>

</div>
</div>
</div>

</div>


<div
style={{
display: 'flex',
flexDirection: 'column',
gap: '16px'
}}
>


<div className="card">

<div className="card-header">

<span className="card-title">
Schnellüberweisung
</span>

</div>


<div className="quick-form">

<div className="quick-input-group">

<label>
Empfänger
</label>

<input
type="text"
placeholder="Name des Empfängers"
/>

</div>


<div className="quick-input-group">

<label>
IBAN
</label>

<input
type="text"
placeholder="DE00 0000 0000 0000 0000 00"
/>

</div>


<div className="quick-row">

<div className="quick-input-group">

<label>
Betrag (€)
</label>

<input
type="number"
placeholder="0,00"
/>

</div>


<div className="quick-input-group">

<label>
Datum
</label>

<input
type="date"
defaultValue="2026-03-09"
/>

</div>

</div>


<div className="quick-input-group">

<label>
Verwendungszweck
</label>

<input
type="text"
placeholder="z.B. Rechnung März"
/>

</div>


<button
className="btn-primary"
onClick={() => window.dispatchEvent(new Event('open-securego'))}
>
↗ Überweisung ausführen
</button>

</div>
</div>


<div className="card">

<div className="card-header">

<span className="card-title">
📬 Postfach
</span>

<span
className="card-link"
onClick={() => goTo('postfach')}
>
Alle →
</span>

</div>


<div className="card-body">

<div className="mail-item unread">

<div className="mail-icon">
📩
</div>

<div>

<div className="mail-subject">
Kontoauszug Februar 2026
</div>

<div className="mail-preview">
Ihr monatlicher Kontoauszug steht bereit...
</div>

<div className="mail-date">
08.03.2026
</div>

</div>

</div>


<div className="mail-item unread">

<div className="mail-icon">
📩
</div>

<div>

<div className="mail-subject">
SpardaSecureGo+ aktiviert
</div>

<div className="mail-preview">
Ihr neues Gerät wurde erfolgreich registriert...
</div>

<div className="mail-date">
06.03.2026
</div>

</div>

</div>


<div className="mail-item">

<div className="mail-icon">
📧
</div>

<div>

<div className="mail-subject">
Wichtige Mitteilung zur VoP
</div>

<div className="mail-preview">
Ab 9. Oktober automatische Empfängerprüfung...
</div>

<div className="mail-date">
01.03.2026
</div>

</div>

</div>

</div>
</div>

</div>

</div>

</section>
);
}

export default Dashboard;
