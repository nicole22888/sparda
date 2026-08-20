import React, { useState, useEffect } from 'react';

// ─── ⚡ DYNAMIC: ACCEPT INJECTED PROPS FROM DATABASE ───
function Dauerauftrag({ goTo, user }) {
  // ─── ⚡ PURE DYNAMIC STATE: ZERO HARDCODED FALLBACKS ───
  const [orders, setOrders] = useState([]);
  const [nextExecutionDate, setNextExecutionDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStandingOrders = async () => {
      try {
        // Query the unified Express endpoint directly to load from the server source of truth
        const response = await fetch('/api/v1/dauerauftraege');
        const data = await response.json();
        
        if (data && data.success) {
          setOrders(data.orders || []);
          setNextExecutionDate(data.nextExecutionDate || null);
        }
      } catch (err) {
        console.error("SANTOS CORE ENGINE // Standing orders query failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandingOrders();
  }, []);

  // Helper formatting function
  const formatCurrency = (val) => (val || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="page active" id="page-dauerauftrag">
      <div className="page-header">
        <div className="page-title">Daueraufträge</div>
        {/* ⚡ STRICT DATABASE BINDINGS: DYNAMIC COUNT & EXECUTION DATE ─── */}
        <div className="page-subtitle">
          {orders.length} {orders.length === 1 ? 'aktiver Dauerauftrag' : 'aktive Daueraufträge'}
          {nextExecutionDate ? ` · Nächste Ausführung: ${nextExecutionDate}` : ''}
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
          {/* ─── ⚡ DYNAMIC STANDING ORDERS RENDERING ENGINE ─── */}
          {orders.length > 0 ? (
            orders.map((da, idx) => (
              <div className="dauerauftrag-item" key={da.id || idx}>
                <div className="da-icon" style={{ background: da.bg_color || da.bgColor || '#f0f4ff' }}>
                  {da.icon || '📋'}
                </div>

                <div className="da-info">
                  <div className="da-name">{da.recipient_name || da.recipientName}</div>
                  <div className="da-iban">{da.recipient_iban || da.recipientIban}</div>
                  <div className="da-schedule">{da.schedule_text || da.scheduleText}</div>
                </div>

                <div>
                  <div className="da-amount">
                    −{formatCurrency(da.amount)} €
                  </div>
                  <span className={`tag ${da.statusClass || 'tag-green'}`}>
                    {da.status || 'Aktiv'}
                  </span>
                </div>

                <div className="da-actions">
                  <button className="da-btn">✏️</button>
                  <button className="da-btn">🗑️</button>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>
              Keine aktiven Daueraufträge vorhanden.
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Dauerauftrag;
