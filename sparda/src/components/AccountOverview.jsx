export default function AccountOverview({ onNavigate }) {
  const accounts = [
    { id: 1, name: 'SpardaGiro Classic', iban: 'DE89 3006 0010 0001 2345 67', balance: 14852.30, type: 'Girokonto' },
    { id: 2, name: 'SpardaSpar Flex', iban: 'DE42 3006 0010 0002 9876 54', balance: 32400.00, type: 'Tagesgeld' },
    { id: 3, name: 'UnionDepot', iban: '5501 9823 10', balance: 18450.75, type: 'Depot' }
  ];

  const recentTransactions = [
    { id: 1, name: 'Rewe Markt GmbH', date: '16.08.2026', amount: -45.80 },
    { id: 2, name: 'Gehalteingang ACME Corp', date: '15.08.2026', amount: 3450.00 },
    { id: 3, name: 'Stadtwerke Strom', date: '12.08.2026', amount: -89.00 }
  ];

  return (
    <div className="account-overview" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Account Balances Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {accounts.map((acc) => (
          <div key={acc.id} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>{acc.type}</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a', margin: '0.25rem 0' }}>{acc.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', marginBottom: '1rem' }}>{acc.iban}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#003A70' }}>
              {acc.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#0f172a' }}>Schnellzugriff</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('ueberweisung')} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#003A70', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            + Neue Überweisung
          </button>
          <button onClick={() => onNavigate('umsaetze')} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            🔍 Umsätze durchsuchen
          </button>
          <button onClick={() => onNavigate('postfach')} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            📬 Kontoauszüge abrufen
          </button>
        </div>
      </div>

      {/* Recent Transactions Snippet */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Letzte Umsätze</h3>
          <button onClick={() => onNavigate('umsaetze')} style={{ background: 'none', border: 'none', color: '#003A70', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            Alle anzeigen →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentTransactions.map((tx) => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#0f172a' }}>{tx.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{tx.date}</div>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: tx.amount > 0 ? '#00875A' : '#0f172a' }}>
                {tx.amount > 0 ? `+${tx.amount.toFixed(2)} €` : `${tx.amount.toFixed(2)} €`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
