import { useState } from 'react';

export default function PageDauerauftrag() {
  const [standingOrders, setStandingOrders] = useState([
    {
      id: 1,
      recipient: 'Wohnungsbau GmbH (Miete)',
      iban: 'DE89 3006 0010 0011 2233 44',
      amount: '850,00 €',
      interval: 'Monatlich',
      firstExecution: '01.09.2026',
      nextExecution: '01.09.2026',
      status: 'Aktiv'
    },
    {
      id: 2,
      recipient: 'Fitness First Studio',
      iban: 'DE44 5001 0060 9988 7766 55',
      amount: '49,90 €',
      interval: 'Monatlich',
      firstExecution: '15.09.2026',
      nextExecution: '15.09.2026',
      status: 'Aktiv'
    },
    {
      id: 3,
      recipient: 'SpardaSpar Flex Sparrate',
      iban: 'DE42 3006 0010 0002 9876 54',
      amount: '250,00 €',
      interval: 'Monatlich',
      firstExecution: '01.09.2026',
      nextExecution: '01.09.2026',
      status: 'Aktiv'
    }
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState('Monatlich');

  const toggleStatus = (id) => {
    setStandingOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status: order.status === 'Aktiv' ? 'Pausiert' : 'Aktiv' }
          : order
      )
    );
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!recipient || !iban || !amount) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    const newOrder = {
      id: Date.now(),
      recipient,
      iban,
      amount: `${parseFloat(amount).toFixed(2).replace('.', ',')} €`,
      interval,
      firstExecution: '01.09.2026',
      nextExecution: '01.09.2026',
      status: 'Aktiv'
    };

    setStandingOrders([...standingOrders, newOrder]);
    setShowNewModal(false);
    setRecipient('');
    setIban('');
    setAmount('');
  };

  return (
    <div className="page-dauerauftrag">
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0a192f' }}>Daueraufträge verwalten</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Übersicht und Erstellung wiederkehrender Zahlungen für SpardaGiro Classic
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: '#003A70', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Neuer Dauerauftrag
        </button>
      </div>

      {/* Orders List Container */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Empfänger</th>
              <th style={{ padding: '0.85rem 1rem' }}>Turnus</th>
              <th style={{ padding: '0.85rem 1rem' }}>Nächste Ausführung</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Betrag</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {standingOrders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{order.recipient}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{order.iban}</div>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{order.interval}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{order.nextExecution}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: order.status === 'Aktiv' ? '#dcfce7' : '#fef3c7',
                    color: order.status === 'Aktiv' ? '#166534' : '#92400e'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                  {order.amount}
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => toggleStatus(order.id)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.75rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {order.status === 'Aktiv' ? 'Pausieren' : 'Aktivieren'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Order Modal */}
      {showNewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '10px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Neuen Dauerauftrag anlegen</h3>
            <form onSubmit={handleCreateOrder}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 'bold' }}>Empfänger</label>
                <input
                  type="text"
                  placeholder="z. B. Vermieter Name"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 'bold' }}>IBAN</label>
                <input
                  type="text"
                  placeholder="DE89..."
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 'bold' }}>Betrag (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 'bold' }}>Turnus</label>
                  <select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Monatlich">Monatlich</option>
                    <option value="Zweimonatlich">Zweimonatlich</option>
                    <option value="Vierteljährlich">Vierteljährlich</option>
                    <option value="Jährlich">Jährlich</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#003A70', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Dauerauftrag Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
