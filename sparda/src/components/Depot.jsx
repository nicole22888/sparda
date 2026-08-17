import React from 'react';

function Depot({ goTo }) {
return (
<section className="page active" id="page-depot">
<div className="page-header">
<div className="page-title">UnionDepot</div>
<div className="page-subtitle">Depot-Nr: 4821 0076 00 · Verwahrart: Inlandsverwahrung · Stand: 09.03.2026</div>
</div>

<div className="depot-summary-bar">
<div className="depot-stat">
<div className="depot-stat-label">Depotwert gesamt</div>
<div className="depot-stat-value">38.412,75 €</div>
</div>

<div className="depot-stat">
<div className="depot-stat-label">Einstandswert</div>
<div className="depot-stat-value">36.600,00 €</div>
</div>

<div className="depot-stat">
<div className="depot-stat-label">Gesamtertrag</div>
<div className="depot-stat-value" style={{ color: 'var(--green)' }}>+1.812,75 €</div>
</div>

<div className="depot-stat">
<div className="depot-stat-label">Performance YTD</div>
<div className="depot-stat-value" style={{ color: 'var(--green)' }}>+4,95 %</div>
</div>
</div>

<div className="card" style={{ marginBottom: '16px' }}>
<div className="card-header">
<span className="card-title">Positionen</span>
<span className="card-link">Sparplan verwalten →</span>
</div>

<div className="card-body">

<div className="fund-item">
<div className="fund-icon">🌍</div>

<div>
<div className="fund-name">UniGlobal net</div>
<div className="fund-isin">ISIN: DE0008491051</div>
</div>

<div className="fund-shares">
12,500 Anteile · Sparplan 100 €/Monat
</div>

<div className="fund-value">
<div className="fund-price">21.480,00 €</div>
<div className="fund-perf up">▲ +5,82 %</div>
</div>
</div>

<div className="fund-item">
<div className="fund-icon">🇪🇺</div>

<div>
<div className="fund-name">UniEuropa net</div>
<div className="fund-isin">ISIN: DE0008491069</div>
</div>

<div className="fund-shares">
8,750 Anteile · Sparplan 50 €/Monat
</div>

<div className="fund-value">
<div className="fund-price">9.187,50 €</div>
<div className="fund-perf up">▲ +3,20 %</div>
</div>
</div>

<div className="fund-item">
<div className="fund-icon">⚖️</div>

<div>
<div className="fund-name">UniRak Nachhaltig A</div>
<div className="fund-isin">ISIN: DE0008491028</div>
</div>

<div className="fund-shares">
5,200 Anteile
</div>

<div className="fund-value">
<div className="fund-price">5.460,00 €</div>
<div className="fund-perf down">▼ −0,80 %</div>
</div>
</div>

<div className="fund-item">
<div className="fund-icon">🏦</div>

<div>
<div className="fund-name">UniOptima</div>
<div className="fund-isin">ISIN: DE0008491077</div>
</div>

<div className="fund-shares">
2,315 Anteile
</div>

<div className="fund-value">
<div className="fund-price">2.285,25 €</div>
<div className="fund-perf up">▲ +1,44 %</div>
</div>
</div>

</div>
</div>
</section>
);
}

export default Depot;
