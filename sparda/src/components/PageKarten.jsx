import { useState } from 'react';

export default function PageKarten() {
  const [cards, setCards] = useState([
    {
      id: 'card_1',
      name: 'SpardaGiro Girocard (Debit Card)',
      cardNumber: '•••• •••• •••• 4092',
      account: 'SpardaGiro Classic',
      expiry: '12/28',
      type: 'girocard',
      active: true,
      limit: 1000,
      contactless: true
    },
    {
      id: 'card_2',
      name: 'SpardaMastercard Classic',
      cardNumber: '•••• •••• •••• 8821',
      account: 'SpardaGiro Classic',
      expiry: '08/27',
      type: 'mastercard',
      active: true,
      limit: 2500,
      contactless: true
    }
  ]);

  const toggleCardStatus = (id) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, active: !card.active } : card
      )
    );
  };

  const toggleContactless = (id) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, contactless: !card.contactless } : card
      )
    );
  };

  const handleLimitChange = (id, newLimit) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, limit: Number(newLimit) } : card
      )
    );
  };

  return (
    <div className="page-karten">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0a192f' }}>Kartenverwaltung</h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Verwalten Sie Ihre Debit- und Kreditkarten, Einstellungen und Tageslimits.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            {/* Card Graphic View */}
            <div
              style={{
                background: card.type === 'mastercard'
                  ? 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)'
                  : 'linear-gradient(135deg, #003A70 0%, #0056b3 100%)',
                color: '#fff',
                padding: '1.5rem',
                borderRadius: '12px 12px 0 0',
                position: 'relative',
                opacity: card.active ? 1 : 0.6
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>
                  Sparda-Bank
                </span>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {card.type === 'mastercard' ? 'Mastercard' : 'Girocard'}
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '1.5rem' }}>
                {card.cardNumber}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.9 }}>
                <div>Gültig bis: {card.expiry}</div>
                <div>{!card.active && '⚠️ KARTE GESPERRT'}</div>
              </div>
            </div>

            {/* Card Controls Panel */}
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Karten-Status</span>
                <button
                  onClick={() => toggleCardStatus(card.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    backgroundColor: card.active ? '#fee2e2' : '#dcfce7',
                    color: card.active ? '#991b1b' : '#166534'
                  }}
                >
                  {card.active ? 'Karte temporär sperren' : 'Karte entsperren'}
                </button>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1rem 0' }} />

              {/* Contactless Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b' }}>Kontaktloses Zahlen</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NFC & PIN-freie Zahlung am Terminal</div>
                </div>
                <input
                  type="checkbox"
                  checked={card.contactless}
                  disabled={!card.active}
                  onChange={() => toggleContactless(card.id)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* Daily Limit Settings */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Tageslimit (Geldautomat)</span>
                  <span style={{ fontWeight: 'bold', color: '#003A70' }}>{card.limit} €</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={card.limit}
                  disabled={!card.active}
                  onChange={(e) => handleLimitChange(card.id, e.target.value)}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => alert('PIN-Anforderung per Post veranlasst.')}
                  disabled={!card.active}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  PIN anfordern
                </button>
                <button
                  onClick={() => alert('Ersatzkarte wurde angefordert.')}
                  disabled={!card.active}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Ersatzkarte
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
