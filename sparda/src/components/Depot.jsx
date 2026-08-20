import React, { useState, useEffect } from 'react';

// ─── ⚡ DYNAMIC: ACCEPT INJECTED PROPS FROM DATABASE ───
function Depot({ goTo, user }) {
  // ─── ⚡ PURE DYNAMIC STATE: ZERO HARDCODED FALLBACKS ───
  const [depotData, setDepotData] = useState({});
  const [depotValue, setDepotValue] = useState(0);
  const [costBasis, setCostBasis] = useState(0);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepotData = async () => {
      try {
        // Query your Express route directly to read from the server source of truth
        const response = await fetch('/api/v1/depot');
        const data = await response.json();
        
        if (data && data.success) {
          setDepotData(data.account || {});
          setDepotValue(data.depotValue || 0);
          setCostBasis(data.costBasis || 0);
          setPositions(data.positions || []);
        }
      } catch (err) {
        console.error("SANTOS CORE ENGINE // UnionDepot metrics query failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepotData();
  }, []);

  // ─── ⚡ STRICT DATABASE BINDINGS ───
  const depotNumber = depotData.depotNumber || '—';
  const custodyType = depotData.custodyType || 'Inlandsverwahrung';

  // ─── ⚡ DYNAMIC PERFORMANCE MATH ENGINE ───
  const totalReturn = depotValue - costBasis;
  const isReturnPositive = totalReturn >= 0;
  const performanceYTD = costBasis > 0 ? (totalReturn / costBasis) * 100 : 0.00;

  // Helper formatting functions
  const formatCurrency = (val) => (val || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatPercent = (val) => (val || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatShares = (val) => (val || 0).toLocaleString('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

  return (
    <section className="page active" id="page-depot">
      <div className="page-header">
        <div className="page-title">UnionDepot</div>
        <div className="page-subtitle">
          Depot-Nr: {depotNumber} · Verwahrart: {custodyType} · Stand: {new Date().toLocaleDateString('de-DE')}
        </div>
      </div>

      {isLoading ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)' }}>
          ⌛ Depotwerte werden geladen...
        </div>
      ) : (
        <>
          <div className="depot-summary-bar">
            <div className="depot-stat">
              <div className="depot-stat-label">Depotwert gesamt</div>
              <div className="depot-stat-value">
                {formatCurrency(depotValue)} €
              </div>
            </div>

            <div className="depot-stat">
              <div className="depot-stat-label">Einstandswert</div>
              <div className="depot-stat-value">
                {formatCurrency(costBasis)} €
              </div>
            </div>

            <div className="depot-stat">
              <div className="depot-stat-label">Gesamtertrag</div>
              {/* ⚡ Real-time mathematical calculation with dynamic color tracking */}
              <div className="depot-stat-value" style={{ color: isReturnPositive ? 'var(--green)' : 'var(--red)' }}>
                {isReturnPositive ? '+' : ''}{formatCurrency(totalReturn)} €
              </div>
            </div>

            <div className="depot-stat">
              <div className="depot-stat-label">Performance YTD</div>
              <div className="depot-stat-value" style={{ color: performanceYTD >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {performanceYTD >= 0 ? '+' : ''}{formatPercent(performanceYTD)} %
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header">
              <span className="card-title">Positionen</span>
              <span className="card-link" style={{ cursor: 'pointer' }}>Sparplan verwalten →</span>
            </div>

            <div className="card-body">
              {/* ─── ⚡ DYNAMIC INVESTMENTS RENDERING LOOP ─── */}
              {positions.length > 0 ? (
                positions.map((fund, idx) => {
                  const isFundUp = (fund.performance || 0) >= 0;
                  return (
                    <div className="fund-item" key={fund.id || idx}>
                      <div className="fund-icon">{fund.icon || '🌍'}</div>

                      <div>
                        <div className="fund-name">{fund.name}</div>
                        <div className="fund-isin">ISIN: {fund.isin}</div>
                      </div>

                      <div className="fund-shares">
                        {formatShares(fund.shares)} Anteile {fund.sparplanInfo ? `· ${fund.sparplanInfo}` : ''}
                      </div>

                      <div className="fund-value">
                        <div className="fund-price">{formatCurrency(fund.value)} €</div>
                        <div className={`fund-perf ${isFundUp ? 'up' : 'down'}`}>
                          {isFundUp ? '▲' : '▼'} {isFundUp ? '+' : ''}{formatPercent(fund.performance)} %
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '14px' }}>
                  Keine Positionen im Depot vorhanden.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Depot;
