import React, { useState, useEffect } from 'react';

function Depot({ goTo }) {
  // ─── ⚡ NEW: LIVE PORTFOLIO STATE HANDLERS ───
  const [depotValue, setDepotValue] = useState(38412.75);
  const [costBasis, setCostBasis] = useState(36600.00);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepotData = async () => {
      try {
        // Query your Express route directly to read from the server source of truth
        const response = await fetch('/api/v1/depot');
        const data = await response.json();
        
        if (data && data.success) {
          setDepotValue(data.depotValue);
          setCostBasis(data.costBasis);
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

  // ─── ⚡ NEW: DYNAMIC PERFORMANCE MATH ENGINE ───
  const totalReturn = depotValue - costBasis;
  const isReturnPositive = totalReturn >= 0;
  const performanceYTD = costBasis > 0 ? (totalReturn / costBasis) * 100 : 0.00;

  return (
    <section className="page active" id="page-depot">
      <div className="page-header">
        <div className="page-title">UnionDepot</div>
        <div className="page-subtitle">Depot-Nr: 4821 0076 00 · Verwahrart: Inlandsverwahrung · Stand: {new Date().toLocaleDateString('de-DE')}</div>
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
                {depotValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
            </div>

            <div className="depot-stat">
              <div className="depot-stat-label">Einstandswert</div>
              <div className="depot-stat-value">
                {costBasis.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
            </div>

            <div className="depot-stat">
              <div className="depot-stat-label">Gesamtertrag</div>
              {/* ⚡ FIXED: Real-time mathematical calculation with dynamic color tracking */}
              <div className="depot-stat-value" style={{ color: isReturnPositive ? 'var(--green)' : 'var(--red)' }}>
                {isReturnPositive ? '+' : ''}{totalReturn.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
            </div>

            <div className="depot-stat">
              <div className="depot-stat-label">Performance YTD</div>
              <div className="depot-stat-value" style={{ color: performanceYTD >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {performanceYTD >= 0 ? '+' : ''}{performanceYTD.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header">
              <span className="card-title">Positionen</span>
              <span className="card-link" style={{ cursor: 'pointer' }}>Sparplan verwalten →</span>
            </div>

            <div className="card-body">
              {/* ─── ⚡ NEW: DYNAMIC INVESTMENTS RENDERING LOOP ─── */}
              {positions.length > 0 ? (
                positions.map((fund, idx) => {
                  const isFundUp = fund.performance >= 0;
                  return (
                    <div className="fund-item" key={idx}>
                      <div className="fund-icon">{fund.icon || '🌍'}</div>

                      <div>
                        <div className="fund-name">{fund.name}</div>
                        <div className="fund-isin">ISIN: {fund.isin}</div>
                      </div>

                      <div className="fund-shares">
                        {fund.shares.toLocaleString('de-DE', { minimumFractionDigits: 3 })} Anteile {fund.sparplanInfo ? `· ${fund.sparplanInfo}` : ''}
                      </div>

                      <div className="fund-value">
                        <div className="fund-price">{fund.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</div>
                        <div className={`fund-perf ${isFundUp ? 'up' : 'down'}`}>
                          {isFundUp ? '▲' : '▼'} {isFundUp ? '+' : ''}{fund.performance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} %
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Fallback layout array structure to match your exact CSS tokens if db is clean */
                <>
                  <div className="fund-item">
                    <div className="fund-icon">🌍</div>
                    <div>
                      <div className="fund-name">UniGlobal net</div>
                      <div className="fund-isin">ISIN: DE0008491051</div>
                    </div>
                    <div className="fund-shares">12,500 Anteile · Sparplan 100 €/Monat</div>
                    <div className="fund-value">
                      <div className="fund-price">21.480,00 €</div>
                      <div className="fund-perf up">▲ +5,82 %</div>
                    </div>
                  </div>

                  <div className="fund-item">
                    <div className="fund-icon">🇪🇺</div>
                    <div>
                      <div className="fund-name">UniEuropa net</div>
                      <div className="fund-isin">ISIN: DE0008491069</div>
                    </div>
                    <div className="fund-shares">8,750 Anteile · Sparplan 50 €/Monat</div>
                    <div className="fund-value">
                      <div className="fund-price">9.187,50 €</div>
                      <div className="fund-perf up">▲ +3,20 %</div>
                    </div>
                  </div>

                  <div className="fund-item">
                    <div className="fund-icon">⚖️</div>
                    <div>
                      <div className="fund-name">UniRak Nachhaltig A</div>
                      <div className="fund-isin">ISIN: DE0008491028</div>
                    </div>
                    <div className="fund-shares">5,200 Anteile</div>
                    <div className="fund-value">
                      <div className="fund-price">5.460,00 €</div>
                      <div className="fund-perf down">▼ −0,80 %</div>
                    </div>
                  </div>

                  <div className="fund-item">
                    <div className="fund-icon">🏦</div>
                    <div>
                      <div className="fund-name">UniOptima</div>
                      <div className="fund-isin">ISIN: DE0008491077</div>
                    </div>
                    <div className="fund-shares">2,315 Anteile</div>
                    <div className="fund-value">
                      <div className="fund-price">2.285,25 €</div>
                      <div className="fund-perf up">▲ +1,44 %</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Depot;
