import { Link } from 'react-router-dom';

export default function PageKonto() {
  const accounts = [
    {
      id: 'giro',
      title: 'SpardaGiro Classic',
      iban: 'DE89 3006 0010 0001 2345 67',
      balance: '14.852,30 €',
      type: 'Girokonto',
      badge: 'Hauptkonto',
      color: '#003A70'
    },
    {
      id: 'flex',
      title: 'SpardaSpar Flex',
      iban: 'DE42 3006 0010 0002 9876 54',
      balance: '32.400,00 €',
      type: 'Sparkonto',
      badge: '2,25% p.a.',
      color: '#00875A'
    },
    {
      id: 'depot',
      title: 'UnionDepot Portfolio',
      iban: 'Depot-Nr: 48920192',
      balance: '18.920,45 €',
      type: 'Wertpapierdepot',
      badge: '+4,8%',
      color: '#6B37BF'
    }
  ];

  const recentTransactions = [
    { id: 1, name: 'Rewe Markt GmbH', date: '16.08.2026', amount: '-45,80 €', category: 'Einkauf', type: 'negative' },
    { id: 2, name: 'Gehalteingang ACME Corp', date: '15.08.2026', amount: '+3.450,00 €', category: 'Gehalt', type: 'positive' },
    { id: 3, name: 'Stadtwerke Strom', date: '12.08.2026', amount: '-89,00 €', category: 'Nebenkosten', type: 'negative' },
    { id: 4, name: 'Amazon EU S.a.r.l.', date: '10.08.2026', amount: '-29,99 €', category: 'Online-Shopping', type: 'negative' }
  ];

  return (
    <div className="page-konto">
      {/* Page Title Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--navy-900, #0a192f)' }}>Kontoübersicht</h1>
          <p style={{ color: 'var(--gray-500, #64748b)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Willkommen zurück, ix_prinx
          </p>
        </div>
        <Link to="/ueberweisung" className="btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.2rem', backgroundColor: '#003A70', color: '#fff', borderRadius: '6px', fontWeight: 'bold' }}>
          + Neue Überweisung
        </Link>
      </div>

      {/* Total Net Assets Banner */}
      <div className="total-balance-card" style={{ background: 'linear-gradient(135deg, #003A70 0%, #002244 100%)', color: '#fff', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Gesamtvermögen</span>
        <h2 style={{ fontSize: '2.2rem', margin: '0.3rem 0', fontWeight: 'bold' }}>66.172,75 €</h2>
        <span style={{ fontSize: '0.8rem', opacity: '0.7' }}>Stand: 17.08.2026 • 17:00 Uhr</span>
      </div>

      {/* Account Cards Grid */}
      <div className="accounts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {accounts.map((acc) => (
          <div key={acc.id} className="account-card" style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#fff', borderTop: `4px solid ${acc.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>{acc.type}</span>
                <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.1rem' }}>{acc.title}</h3>
              </div>
              <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {acc.badge}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace', marginBottom: '1rem' }}>{acc.iban}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0f172a' }}>{acc.balance}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Transactions & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Transactions List */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Letzte Umsätze</h3>
            <Link to="/umsaetze" style={{ fontSize: '0.85rem', color: '#003A70', textDecoration: 'none', fontWeight: 'bold' }}>
              Alle anzeigen →
            </Link>
          </div>
          <div className="transaction-list">
            {recentTransactions.map((tx) => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{tx.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{tx.date} • {tx.category}</div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: tx.type === 'positive' ? '#00875A' : '#0f172a' }}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Shortcuts Panel */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Schnellzugriff</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/ueberweisung" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid #f1f5f9', borderRadius: '6px', textDecoration: 'none', color: '#334155', fontWeight: '500' }}>
              <span>💸</span> Inland & SEPA Überweisung
            </Link>
            <Link to="/dauerauftrag" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid #f1f5f9', borderRadius: '6px', textDecoration: 'none', color: '#334155', fontWeight: '500' }}>
              <span>🔄</span> Dauerauftrag verwalten
            </Link>
            <Link to="/karten" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid #f1f5f9', borderRadius: '6px', textDecoration: 'none', color: '#334155', fontWeight: '500' }}>
              <span>💳</span> Karte sperren / limitieren
            </Link>
            <Link to="/postfach" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid #f1f5f9', borderRadius: '6px', textDecoration: 'none', color: '#334155', fontWeight: '500' }}>
              <span>📬</span> Bank-Mitteilungen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
