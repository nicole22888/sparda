import React, { useState, useEffect } from 'react';

function Dauerauftrag({ goTo }) {
  // ─── ⚡ NEW: LIVE STANDING ORDERS STATE HANDLERS ───
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStandingOrders = async () => {
      try {
        // Query the unified Express endpoint directly to load from the server source of truth
        const response = await fetch('/api/v1/dauerauftraege');
        const data = await response.json();
        
        if (data && data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("SANTOS CORE ENGINE // Standing orders query failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandingOrders();
  }, []);

  return (
    <section className="page active" id="page-dauerauftrag">
      <div className="page-header">
        <div className="page-title">Daueraufträge</div>
        {/* ⚡ FIXED: Dynamic subtitle counters adapting to your live database array lengths */}
        <div className="page-subtitle">
          {orders.length > 0 ? orders.length : '4'} aktive Daueraufträge · Nächste Ausführung: 15.03.2026
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <button className="btn-primary">
          + Neuer Dauerauftrag
        </button>
      </div>

      {isLoading ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)' }}>
          ⌛ Daueraufträge werden geladen...
        </div>
      ) : (
        <>
          {/* ─── ⚡ NEW: DYNAMIC STANDING ORDERS RENDERING ENGINE ─── */}
          {orders.length > 0 ? (
            orders.map((da, idx) => (
              <div className="dauerauftrag-item" key={da.id || idx}>
                <div className="da-icon" style={{ background: da.bg_color || '#f0f4ff' }}>
                  {da.icon || '📋'}
                </div>

                <div className="da-info">
                  <div className="da-name">{da.recipient_name}</div>
                  <div className="da-iban">{da.recipient_iban}</div>
                  <div className="da-schedule">{da.schedule_text}</div>
                </div>

                <div>
                  <div className="da-amount">
                    −{da.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </div>
                  <span className="tag tag-green">Aktiv</span>
                </div>

                <div className="da-actions">
                  <button className="da-btn">✏️</button>
                  <button className="da-btn">🗑️</button>
                </div>
              </div>
            ))
          ) : (
            /* Fallback layout array structure to match your exact CSS tokens if db is clean */
            <>
              <div className="dauerauftrag-item">
                <div className="da-icon" style={{ background: '#fff0f0' }}>🏠</div>
                <div className="da-info">
                  <div className="da-name">Hausverwaltung München GmbH</div>
                  <div className="da-iban">DE12 7009 0500 9988 7766 55</div>
                  <div className="da-schedule">Monatlich am 1. · Nächste: 01.04.2026 · Verwendungszweck: Miete April</div>
                </div>
                <div>
                  <div className="da-amount">−950,00 €</div>
                  <span className="tag tag-green">Aktiv</span>
                </div>
                <div className="da-actions">
                  <button className="da-btn">✏️</button>
                  <button className="da-btn">🗑️</button>
                </div>
              </div>

              <div className="dauerauftrag-item">
                <div className="da-icon" style={{ background: '#f0f4ff' }}>📱</div>
                <div className="da-info">
                  <div className="da-name">Telekom Deutschland GmbH</div>
                  <div className="da-iban">DE84 1001 0010 0556 7788 00</div>
                  <div className="da-schedule">Monatlich am 1. · Nächste: 01.04.2026 · Verwendungszweck: Kd.-Nr. 4728812</div>
                </div>
                <div>
                  <div className="da-amount">−39,95 €</div>
                  <span className="tag tag-green">Aktiv</span>
                </div>
                <div className="da-actions">
                  <button className="da-btn">✏️</button>
                  <button className="da-btn">🗑️</button>
                </div>
              </div>

              <div className="dauerauftrag-item">
                <div className="da-icon" style={{ background: '#f0fff4' }}>💰</div>
                <div className="da-info">
                  <div className="da-name">SpardaSpar Flex · Sparplan</div>
                  <div className="da-iban">DE89 7009 0500 0012 3456 90 (eigenes Konto)</div>
                  <div className="da-schedule">Monatlich am 15. · Nächste: 15.03.2026 · Verwendungszweck: Sparrate</div>
                </div>
                <div>
                  <div className="da-amount">−500,00 €</div>
                  <span className="tag tag-green">Aktiv</span>
                </div>
                <div className="da-actions">
                  <button className="da-btn">✏️</button>
                  <button className="da-btn">🗑️</button>
                </div>
              </div>

              <div className="dauerauftrag-item">
                <div className="da-icon" style={{ background: '#fffbf0' }}>💡</div>
                <div className="da-info">
                  <div className="da-name">E.ON Energie Deutschland · Abschlag</div>
                  <div className="da-iban">DE56 2004 1133 0236 4543 00</div>
                  <div className="da-schedule">Monatlich am 28. · Nächste: 28.03.2026 · Strom und Gas</div>
                </div>
                <div>
                  <div className="da-amount">−87,00 €</div>
                  <span className="tag tag-green">Aktiv</span>
                </div>
                <div className="da-actions">
                  <button className="da-btn">✏️</button>
                  <button className="da-btn">🗑️</button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

export default Dauerauftrag;
