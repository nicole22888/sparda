import React, { useState, useEffect } from 'react';

function Sparkonto() {
  // ─── ⚡ NEW: LIVE LEDGER STATE HANDLERS ───
  const [balance, setBalance] = useState(15240.00); // Dynamic fallback default
  const [interestHistory, setInterestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavingsAccountData = async () => {
      try {
        // Query your Express route directly to read from the server source of truth
        const response = await fetch('/api/v1/sparkonto');
        const data = await response.json();
        
        if (data && data.success) {
          setBalance(data.balance);
          setInterestHistory(data.history || []);
        }
      } catch (err) {
        console.error("Savings query failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavingsAccountData();
  }, []);

  return (
    <section className="page active" id="page-sparkonto">
      <div className="page-header">
        <div className="page-title">SpardaSpar Flex</div>
        <div className="page-subtitle">DE89 7009 0500 0012 3456 90</div>
      </div>

      {isLoading ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)' }}>
          ⌛ Sparkonto-Daten werden geladen...
        </div>
      ) : (
        <>
          <div className="spar-hero">
            <div>
              <div className="spar-balance-label">Aktuelles Guthaben</div>
              {/* ⚡ FIXED: Linked to live dynamic balance variable with German currency formatting */}
              <div className="spar-balance">
                {balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
              <div style={{ opacity: 0.7, fontSize: '13px' }}>
                Zinsgutschrift: zuletzt 28.02.2026 · +31,75 €
              </div>
            </div>

            <div className="spar-rate">
              <div className="spar-rate-value">2,50 %</div>
              <div className="spar-rate-label">p.a. · variabel</div>
            </div>
          </div>

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Zinsumsätze</span>
              </div>

              <div className="card-body">
                {/* ─── ⚡ NEW: DYNAMIC ROW RENDERING FROM THE SERVER SOURCE ─── */}
                {interestHistory.length > 0 ? (
                  interestHistory.map((tx, idx) => (
                    <div className="tx-item" key={idx}>
                      <div className={`tx-icon ${tx.type || 'income'}`}>
                        {tx.icon || '💸'}
                      </div>

                      <div className="tx-info">
                        <div className="tx-name">{tx.name}</div>
                        <div className="tx-detail">{tx.detail}</div>
                      </div>

                      <div className="tx-right">
                        <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                          {tx.amount > 0 ? '+' : ''}
                          {tx.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                        </div>
                        <div className="tx-date">
                          {new Date(tx.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  /* Fallback static layouts for testing prior to deep database population loops */
                  <>
                    <div className="tx-item">
                      <div className="tx-icon income">💸</div>
                      <div className="tx-info">
                        <div className="tx-name">Zinsgutschrift</div>
                        <div className="tx-detail">2,5 % p.a. · Feb 2026</div>
                      </div>
                      <div className="tx-right">
                        <div className="tx-amount positive">+31,75 €</div>
                        <div className="tx-date">28.02.2026</div>
                      </div>
                    </div>

                    <div className="tx-item">
                      <div className="tx-icon income">💸</div>
                      <div className="tx-info">
                        <div className="tx-name">Zinsgutschrift</div>
                        <div className="tx-detail">2,5 % p.a. · Jan 2026</div>
                      </div>
                      <div className="tx-right">
                        <div className="tx-amount positive">+29,88 €</div>
                        <div className="tx-date">31.01.2026</div>
                      </div>
                    </div>

                    <div className="tx-item">
                      <div className="tx-icon transfer">🔁</div>
                      <div className="tx-info">
                        <div className="tx-name">Einzahlung vom Girokonto</div>
                        <div className="tx-detail">Sparrate März</div>
                      </div>
                      <div className="tx-right">
                        <div className="tx-amount positive">+500,00 €</div>
                        <div className="tx-date">01.03.2026</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: '20px' }}>
                <div className="card-title" style={{ marginBottom: '14px' }}>
                  Konditionen
                </div>

                <div className="profil-row">
                  <span className="profil-key">Zinssatz</span>
                  <span className="profil-value" style={{ color: 'var(--green)' }}>
                    2,50 % p.a.
                  </span>
                </div>

                <div className="profil-row">
                  <span className="profil-key">Zinsmethode</span>
                  <span className="profil-value">Monatlich</span>
                </div>

                <div className="profil-row">
                  <span className="profil-key">Kündigungsfrist</span>
                  <span className="profil-value">3 Monate</span>
                </div>

                <div className="profil-row">
                  <span className="profil-key">Einlagensicherung</span>
                  <span className="profil-value">100.000 € (gesetzl.)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Sparkonto;
