import React, { useState, useEffect } from 'react';

function Dashboard({ goTo }) {

  const [accountData, setAccountData] = useState({
    giroBalance: 0,
    sparBalance: 0,
    depotValue: 0,
    recentTransactions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardTruthMetrics = async () => {
      try {
        setIsLoading(true);

        const [transfersRes, sparRes, depotRes] = await Promise.all([
          fetch('/api/v1/transfers'),
          fetch('/api/v1/sparkonto'),
          fetch('/api/v1/depot')
        ]);

        const [transfersData, sparData, depotData] = await Promise.all([
          transfersRes.json(),
          sparRes.json(),
          depotRes.json()
        ]);

        setAccountData({
          giroBalance: transfersData.transactions && transfersData.transactions.length > 0
            ? 2847.93 + transfersData.transactions.reduce((sum, tx) => sum + Number(tx.amount), 0) - (-1455.37)
            : 2847.93,
          sparBalance: sparData.success ? sparData.balance : 15240.00,
          depotValue: depotData.success ? depotData.depotValue : 38412.75,
          recentTransactions: transfersData.success ? transfersData.transactions : []
        });
      } catch (err) {
        console.error("Dashboard aggregation failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardTruthMetrics();
  }, []);

  // ─── COMBINED LIQUID FORTUNE CALCULATOR ───
  const totalNetWorth = accountData.giroBalance + accountData.sparBalance + accountData.depotValue;

  return (
    <section className="page active" id="page-kontoübersicht">
      <div className="page-header">
        <div className="page-title">
          Kontoübersicht {isLoading && <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--gray-400)' }}>⌛ Daten werden geladen...</span>}
        </div>

        <div className="page-subtitle">
          Letzter Login: Heute, 09:14 Uhr · IP: 192.168.1.xxx · Gerät: Chrome/Windows
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
            SpardaGiro Klassik
          </div>

          <div className="account-card-iban">
            DE89 7009 0500 0012 3456 78
          </div>

          {/* ⚡ REACTIVE GIRO BALANCE */}
          <div className="account-card-balance">
            {accountData.giroBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
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
            SpardaSpar Flex
          </div>

          <div className="account-card-iban">
            DE89 7009 0500 0012 3456 90
          </div>

          {/* ⚡ REACTIVE SPARBALANCE */}
          <div className="account-card-balance">
            {accountData.sparBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>

          <div className="account-card-balance-label">
            Guthaben (2,5 % p.a.)
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
            UnionDepot
          </div>

          <div className="account-card-iban">
            Depot-Nr: 4821 0076 00
          </div>

          {/* ⚡ REACTIVE DEPOT VALUE */}
          <div className="account-card-balance">
            {accountData.depotValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>

          <div className="account-card-balance-label">
            Depotwert ▲ +4,8 % YTD
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
            Einnahmen (März)
          </div>

          <div className="stat-box-value positive">
            +3.400,00 €
          </div>

          <div className="stat-box-sub">
            Gehalt + Zinsen
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-label">
            Ausgaben (März)
          </div>

          <div className="stat-box-value negative">
            -1.847,22 €
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
            {totalNetWorth.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
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
            4 aktiv
          </div>

          <div className="stat-box-sub">
            Nächste am 15.03.
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                Letzte Umsätze · Girokonto
              </span>

              <span
                className="card-link"
                onClick={() => goTo('umsätze')}
              >
                Alle anzeigen →
              </span>
            </div>

            <div className="card-body">
              {/* ⚡ 5. DYNAMIC DATABASE PREVIEW STREAM LOOP */}
              {accountData.recentTransactions.length > 0 ? (
                accountData.recentTransactions.slice(0, 8).map((tx, idx) => {
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
                          {Number(tx.amount).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </div>

                        <div className="tx-date">
                          {dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Fallback layout state if no transactions exist in db yet */
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
                Ausgaben nach Kategorien (Feb/Mär)
              </span>
            </div>

            <div className="chart-area">
              <div className="bar-chart">
                <div className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: '65px',
                      background: 'var(--red)'
                    }}
                  ></div>

                  <div className="bar-label">
                    Wohnen
                  </div>
                </div>

                <div className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: '32px',
                      background: 'var(--gray-400)'
                    }}
                  ></div>

                  <div className="bar-label">
                    Lebensmittel
                  </div>
                </div>

                <div className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: '20px',
                      background: 'var(--blue)'
                    }}
                  ></div>

                  <div className="bar-label">
                    Transport
                  </div>
                </div>

                <div className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: '15px',
                      background: 'var(--green)'
                    }}
                  ></div>

                  <div className="bar-label">
                    Freizeit
                  </div>
                </div>

                <div className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: '12px',
                      background: '#f59e0b'
                    }}
                  ></div>

                  <div className="bar-label">
                    Medien
                  </div>
                </div>

                <div className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: '18px',
                      background: '#8b5cf6'
                    }}
                  ></div>

                  <div className="bar-label">
                    Sonstiges
                  </div>
                </div>
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

                  <input
                    type="date"
                    defaultValue="2026-03-09"
                  />
                </div>
              </div>

              <div className="quick-input-group">
                <label>
                  Verwendungszweck
                </label>

                <input
                  type="text"
                  placeholder="z.B. Rechnung März"
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
              <div className="mail-item unread">
                <div className="mail-icon">
                  📩
                </div>

                <div>
                  <div className="mail-subject">
                    Kontoauszug Februar 2026
                  </div>

                  <div className="mail-preview">
                    Ihr monatlicher Kontoauszug steht bereit...
                  </div>

                  <div className="mail-date">
                    08.03.2026
                  </div>
                </div>
              </div>

              <div className="mail-item unread">
                <div className="mail-icon">
                  📩
                </div>

                <div>
                  <div className="mail-subject">
                    SpardaSecureGo+ aktiviert
                  </div>

                  <div className="mail-preview">
                    Ihr neues Gerät wurde erfolgreich registriert...
                  </div>

                  <div className="mail-date">
                    06.03.2026
                  </div>
                </div>
              </div>

              <div className="mail-item">
                <div className="mail-icon">
                  📧
                </div>

                <div>
                  <div className="mail-subject">
                    Wichtige Mitteilung zur VoP
                  </div>

                  <div className="mail-preview">
                    Ab 9. Oktober automatische Empfängerprüfung...
                  </div>

                  <div className="mail-date">
                    01.03.2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
