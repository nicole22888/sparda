import { useState } from 'react';

export default function PageUmsaetze() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const categories = ['Alle', 'Einkauf', 'Gehalt', 'Nebenkosten', 'Online-Shopping', 'Umbuchung'];

  const initialTransactions = [
    { id: 1, name: 'Rewe Markt GmbH', iban: 'DE12 3006 0010 8831 0122 00', date: '16.08.2026', amount: -45.80, category: 'Einkauf', note: 'Kartenzahlung Girocard' },
    { id: 2, name: 'Gehalteingang ACME Corp', iban: 'DE44 5001 0060 0991 2341 99', date: '15.08.2026', amount: 3450.00, category: 'Gehalt', note: 'Monatsgehalt 08/2026' },
    { id: 3, name: 'Stadtwerke Strom', iban: 'DE99 3001 0010 0011 2233 44', date: '12.08.2026', amount: -89.00, category: 'Nebenkosten', note: 'SEPA-Lastschrift Abschlag' },
    { id: 4, name: 'Amazon EU S.a.r.l.', iban: 'DE77 2004 0000 0123 4567 89', date: '10.08.2026', amount: -29.99, category: 'Online-Shopping', note: 'Bestellnummer #203-110293' },
    { id: 5, name: 'SpardaSpar Flex Umbuchung', iban: 'DE42 3006 0010 0002 9876 54', date: '05.08.2026', amount: -500.00, category: 'Umbuchung', note: 'Sparübertrag' },
    { id: 6, name: 'Edeka Center', iban: 'DE55 3006 0010 4421 1109 88', date: '02.08.2026', amount: -78.40, category: 'Einkauf', note: 'Kartenzahlung Girocard' },
    { id: 7, name: 'PayPal Europe S.a.r.l.', iban: 'DE11 1001 0010 0000 9988 77', date: '28.07.2026', amount: -15.50, category: 'Online-Shopping', note: 'Steam Digital Delivery' }
  ];

  const filteredTransactions = initialTransactions.filter((tx) => {
    const matchesSearch = tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.note.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || tx.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-umsaetze">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0a192f' }}>Umsatzanzeige & Suche</h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          SpardaGiro Classic — DE89 3006 0010 0001 2345 67
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="🔍 Name, Verwendungszweck oder IBAN suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', fontSize: '0.95rem' }}
          />
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('Alle'); }}
            style={{ padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Filter zurücksetzen
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#003A70' : '#e2e8f0',
                backgroundColor: selectedCategory === cat ? '#003A70' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#475569',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat ? 'bold' : 'normal'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Datum</th>
              <th style={{ padding: '0.85rem 1rem' }}>Empfänger / Sender</th>
              <th style={{ padding: '0.85rem 1rem' }}>Kategorie</th>
              <th style={{ padding: '0.85rem 1rem' }}>Verwendungszweck</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Betrag</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', whiteSpace: 'nowrap' }}>{tx.date}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{tx.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{tx.iban}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {tx.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{tx.note}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '0.95rem', color: tx.amount > 0 ? '#00875A' : '#0f172a' }}>
                    {tx.amount > 0 ? `+${tx.amount.toFixed(2)} €` : `${tx.amount.toFixed(2)} €`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Keine Umsätze für diese Filterkriterien gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
