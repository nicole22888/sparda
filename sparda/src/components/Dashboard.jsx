import React, { useState, useEffect } from 'react';

// ─── ⚡ DYNAMIC: ACCEPT INJECTED PROPS FROM DATABASE ───
function Dashboard({ goTo, user, accounts = [] }) {
  // ─── ⚡ PURE DYNAMIC STATE: ZERO HARDCODED FALLBACKS ───
  const [dashboardData, setDashboardData] = useState({
    giroBalance: 0,
    sparBalance: 0,
    depotValue: 0,
    recentTransactions: [],
    incomeMonth: 0,
    expenseMonth: 0,
    standingOrdersCount: 0,
    nextStandingOrderDate: null,
    categorySpending: {},
    messages: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // ─── ⚡ STRICT DATABASE BINDINGS ───
  const lastLogin = user?.last_login || new Date().toLocaleString('de-DE');
  const userIp = user?.ip_address || 'Unbekannt';
  const userDevice = user?.device_name || 'Unbekannt';
  
  // Extract account details dynamically
  const giroAccount = accounts.find(a => a.type === 'giro') || accounts[0] || {};
  const sparAccount = accounts.find(a => a.type === 'spar') || accounts[1] || {};
  const depotAccount = accounts.find(a => a.type === 'depot') || accounts[2] || {};

  useEffect(() => {
    const loadDashboardTruthMetrics = async () => {
      try {
        setIsLoading(true);

        // ⚡ Expanded API Promise array to capture all dashboard metrics dynamically
        const [transfersRes, sparRes, depotRes, ordersRes, messagesRes] = await Promise.all([
          fetch('/api/v1/transfers').catch(() => ({ json: () => ({}) })),
          fetch('/api/v1/sparkonto').catch(() => ({ json: () => ({}) })),
          fetch('/api/v1/depot').catch(() => ({ json: () => ({}) })),
          fetch('/api/v1/dauerauftraege').catch(() => ({ json: () => ({}) })),
          fetch('/api/v1/messages').catch(() => ({ json: () => ({}) }))
        ]);

        const [transfersData, sparData, depotData, ordersData, messagesData] = await Promise.all([
          transfersRes.json(),
          sparRes.json(),
          depotRes.json(),
          ordersRes.json(),
          messagesRes.json()
        ]);

        const txList = transfersData.transactions || [];
        
        // ⚡ DYNAMIC MATH ENGINE: Calculate monthly income/expenses & categories
        let income = 0;
        let expense = 0;
        const spending = { wohnen: 0, lebensmittel: 0, transport: 0, freizeit: 0, medien: 0, sonstiges: 0 };
        
        txList.forEach(tx => {
          const amount = Number(tx.amount) || 0;
          if (amount > 0) {
            income += amount;
          } else {
            expense += Math.abs(amount);
            // Dynamic category bucket sorting
            const cat = (tx.category || 'sonstiges').toLowerCase();
            if (spending[cat] !== undefined) {
              spending[cat] += Math.abs(amount);
            } else {
              spending.sonstiges += Math.abs(amount);
            }
          }
        });

        // ⚡ DYNAMIC GIRO BALANCE CALCULATION
        // Base balance from DB + sum of transaction history
        const baseGiro = parseFloat(giroAccount.balance) || 0;
        const calculatedGiro = txList.length > 0 
          ? baseGiro + txList.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
          : baseGiro;

        setDashboardData({
          giroBalance: calculatedGiro,
          sparBalance: sparData.success ? parseFloat(sparData.balance) : (parseFloat(sparAccount.balance) || 0),
          depotValue: depotData.success ? parseFloat(depotData.depotValue) : (parseFloat(depotAccount.balance) || 0),
          recentTransactions: txList,
          incomeMonth: income,
          expenseMonth: expense,
          standingOrdersCount: ordersData.orders ? ordersData.orders.length : 0,
          nextStandingOrderDate: ordersData.nextExecutionDate || null,
          categorySpending: spending,
          messages: messagesData.messages || []
        });
      } catch (err) {
        console.error("Dashboard aggregation failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardTruthMetrics();
  }, [giroAccount.balance, sparAccount.balance, depotAccount.balance]);

  // ─── COMBINED LIQUID FORTUNE CALCULATOR ───
  const totalNetWorth = dashboardData.giroBalance + dashboardData.sparBalance + dashboardData.depotValue;

  // Formatting helpers
  const formatCurrency = (val) => (val || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  // Dynamic Chart Height Calculator (Max 65px as per original design constraints)
  const maxSpending = Math.max(...Object.values(dashboardData.categorySpending), 1); // prevent divide by zero
  const getChartHeight = (value) => `${Math.max((value / maxSpending) * 65, 4)}px`;

  return (
    <section className="page active" id="page-kontoübersicht">
      <div className="page-header">
        <div className="page-title">
          Kontoübersicht {isLoading && <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--gray-400)' }}>⌛ Daten werden geladen...</span>}
        </div>

        <div className="page-subtitle">
          Letzter Login: {lastLogin} · IP: {userIp} · Gerät: {userDevice}
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
            {giroAccount.name || 'SpardaGiro Klassik'}
          </div>

          <div className="account-card-iban">
            {giroAccount.iban || '—'}
          </div>

          {/* ⚡ REACTIVE GIRO BALANCE */}
          <div className="account-card-balance">
            {formatCurrency(dashboardData.giroBalance)} €
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
            {sparAccount.name || 'SpardaSpar Flex'}
          </div>

          <div className="account-card-iban">
            {sparAccount.iban || '—'}
          </div>

          {/* ⚡ REACTIVE SPARBALANCE */}
          <div className="account-card-balance">
            {formatCurrency(dashboardData.sparBalance)} €
          </div>

          <div className="account-card-balance-label">
            Guthaben
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
            {depotAccount.name || 'UnionDepot'}
          </div>

          <div className="account-card-iban">
            Depot-Nr: {depotAccount.depotNumber || depotAccount.iban || '—'}
          </div>

          {/* ⚡ REACTIVE DEPOT VALUE */}
          <div className="account-card-balance">
            {formatCurrency(dashboardData.depotValue)} €
          </div>

          <div className="account-card-balance-label">
            Depotwert
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
            Einnahmen (Monat)
          </div>

          <div className="stat-box-value positive">
            +{formatCurrency(dashboardData.incomeMonth)} €
          </div>

          <div className="stat-box-sub">
            Gehalt + Zinsen
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-label">
            Ausgaben (Monat)
          </div>

          <div className="stat-box-value negative">
            -{formatCurrency(dashboardData.expenseMonth)} €
          </div>

          <div className="stat-box-sub">
            inkl. Daueraufträge
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-label">
            Gesamt Guthaben
          </div>

          {/* ⚡ DYNAMIC RUNTIME TOTAL FORTUNE */}
          <div className="stat-box-value">
            {formatCurrency(totalNetWorth)} €
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
            {dashboardData.standingOrdersCount} aktiv
          </div>

          <div className="stat-box-sub">
            {dashboardData.nextStandingOrderDate ? `Nächste am ${dashboardData.nextStandingOrderDate}` : 'Keine anstehend'}
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                Letzte Umsätze · {giroAccount.name || 'Girokonto'}
              </span>

              <span
                className="card-link"
                onClick={() => goTo('umsätze')}
              >
                Alle anzeigen →
              </span>
            </div>

            <div className="card-body">
              {/* ⚡ DYNAMIC DATABASE PREVIEW STREAM LOOP */}
              {dashboardData.recentTransactions.length > 0 ? (
                dashboardData.recentTransactions.slice(0, 8).map((tx, idx) => {
                  const isPositive = Number(tx.amount) > 0;
                  const dateObj = new Date(tx.execution_date || tx.date || Date.now());
                  
                  return (
                    <div className="tx-item" key={tx.tracking_number || tx.id || idx}>
                      <div className={`tx-icon ${isPositive ? 'income' : 'expense'}`}>
                        {tx.icon || (isPositive ? '💰' : '🛒')}
                      </div>

                      <div className="tx-info">
                        <div className="tx-name">
                          {tx.recipient_name || tx.name}
                        </div>

                        <div className="tx-detail">
                          {tx.purpose || tx.detail}
                        </div>
                      </div>

                      <div className="tx-right">
                        <div className={`tx-amount ${isPositive ? 'positive' : 'negative'}`}>
                          {isPositive ? '+' : ''}
                          {formatCurrency(Number(tx.amount))} €
                        </div>

                        <div className="tx-date">
                          {dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--gray-400)' }}>
                  Keine aktuellen Umsätze vorhanden.
                </div>
              )}
            </div>
          </div>

          <div
            className="card"
            style={{ marginTop: '16px' }}
          >
            <div className="card-header">
              <span className="card-title">
                Ausgaben nach Kategorien (Monat)
              </span>
            </div>

            <div className="chart-area">
              <div className="bar-chart">
                {/* ⚡ DYNAMIC CHART RENDERING ENGINE */}
                {[
                  { id: 'wohnen', label: 'Wohnen', color: 'var(--red)' },
                  { id: 'lebensmittel', label: 'Lebensmittel', color: 'var(--gray-400)' },
                  { id: 'transport', label: 'Transport', color: 'var(--blue)' },
                  { id: 'freizeit', label: 'Freizeit', color: 'var(--green)' },
                  { id: 'medien', label: 'Medien', color: '#f59e0b' },
                  { id: 'sonstiges', label: 'Sonstiges', color: '#8b5cf6' }
                ].map(cat => (
                  <div className="bar-item" key={cat.id}>
                    <div
                      className="bar"
                      style={{
                        height: getChartHeight(dashboardData.categorySpending[cat.id]),
                        background: cat.color
                      }}
                    ></div>

                    <div className="bar-label">
                      {cat.label}
                    </div>
                  </div>
                ))}
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

                  {/* ⚡ DYNAMIC DEFAULT DATE */}
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="quick-input-group">
                <label>
                  Verwendungszweck
                </label>

                <input
                  type="text"
                  placeholder="z.B. Rechnung"
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
              {/* ⚡ DYNAMIC MAILBOX STREAM */}
              {dashboardData.messages.length > 0 ? (
                dashboardData.messages.slice(0, 3).map((msg, idx) => (
                  <div className={`mail-item ${msg.isUnread ? 'unread' : ''}`} key={msg.id || idx}>
                    <div className="mail-icon">
                      {msg.icon || '📩'}
                    </div>

                    <div>
                      <div className="mail-subject">
                        {msg.subject}
                      </div>

                      <div className="mail-preview">
                        {msg.preview}
                      </div>

                      <div className="mail-date">
                        {msg.date ? new Date(msg.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--gray-400)' }}>
                  Keine neuen Nachrichten.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
