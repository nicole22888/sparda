import { useState } from 'react';

export default function PageDepot() {
  const [selectedFund, setSelectedFund] = useState(null);

  const portfolioSummary = {
    depotNumber: '5501 9823 10',
    totalValue: 18450.75,
    totalProfit: 1230.40,
    profitPercent: 7.14
  };

  const fundPositions = [
    {
      isin: 'DE0008491002',
      name: 'UniGlobal - net - A',
      category: 'Aktienfonds',
      units: 42.15,
      currentPrice: 285.40,
      totalValue: 12029.61,
      changePercent: +8.45,
      monthlySavings: '150,00 €'
    },
    {
      isin: 'LU0126315885',
      name: 'UniEuroRenta Classic',
      category: 'Rentenfonds',
      units: 65.80,
      currentPrice: 62.10,
      totalValue: 4086.18,
      changePercent: +2.10,
      monthlySavings: '50,00 €'
    },
    {
      isin: 'DE0009805507',
      name: 'UniImmo: Europa',
      category: 'Immobilienfonds',
      units: 42.30,
      currentPrice: 55.20,
      totalValue: 2334.96,
      changePercent: +1.80,
      monthlySavings: 'Pausiert'
    }
  ];

  return (
    <div className="page-depot">
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0a192f' }}>UnionDepot Übersicht</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Depot-Nr.: {portfolioSummary.depotNumber} — Union Investment
          </p>
        </div>
        <button
          onClick={() => alert('Sparplan-Änderungen werden in einem separaten Formular geöffnet.')}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: '#003A70', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Sparplan anpassen
        </button>
      </div>

      {/* Portfolio Value Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Gesamtwert Depot</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginTop: '0.25rem' }}>
            {portfolioSummary.totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Gesamtertrag / Gewinn</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00875A', marginTop: '0.25rem' }}>
            +{portfolioSummary.totalProfit.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € (+{portfolioSummary.profitPercent}%)
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Monatliche Sparrate</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003A70', marginTop: '0.25rem' }}>
            200,00 €
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 'bold', color: '#334155' }}>
          Fondsbestände ({fundPositions.length})
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Fondsbezeichnung</th>
              <th style={{ padding: '0.85rem 1rem' }}>Kategorie</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Anteile</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Kurs</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Kurswert</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Sparplan</th>
            </tr>
          </thead>
          <tbody>
            {fundPositions.map((fund) => (
              <tr 
                key={fund.isin} 
                onClick={() => setSelectedFund(fund)}
                style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{fund.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>ISIN: {fund.isin}</div>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    {fund.category}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#475569' }}>{fund.units.toFixed(2)}</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#475569' }}>{fund.currentPrice.toFixed(2)} €</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                  {fund.totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#003A70' }}>
                  {fund.monthlySavings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Fund Detail Drawer / Card */}
      {selectedFund && (
        <div style={{ marginTop: '1.5rem', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1.25rem', position: 'relative' }}>
          <button
            onClick={() => setSelectedFund(null)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#0369a1' }}
          >
            ✕
          </button>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>{selectedFund.name}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#0284c7' }}>
            ISIN: {selectedFund.isin} | Typ: {selectedFund.category} | Entwicklung: <strong>+{selectedFund.changePercent}%</strong>
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#003A70', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
              Anteile kaufen
            </button>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', border: '1px solid #003A70', color: '#003A70', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
              Anteile verkaufen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
