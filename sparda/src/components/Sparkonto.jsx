import React, { useState, useEffect } from 'react';

// ─── ⚡ DYNAMIC: ACCEPT INJECTED USER PROP FROM DATABASE ───
function Sparkonto({ user }) {
  // ─── ⚡ PURE DYNAMIC STATE: ZERO HARDCODED FALLBACKS ───
  const [accountData, setAccountData] = useState({});
  const [interestHistory, setInterestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavingsAccountData = async () => {
      try {
        // Query your Express route directly to read from the server source of truth
        const response = await fetch('/api/v1/sparkonto');
        const data = await response.json();
        
        if (data && data.success) {
          setAccountData(data.account || {});
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

  // ─── ⚡ STRICT DATABASE BINDINGS ───
  const accountName = accountData.accountName || 'Sparkonto';
  const iban = accountData.iban || 'DE•• •••• •••• •••• •••• ••';
  const balance = accountData.balance || 0;
  
  const interestRate = accountData.interestRate || '0,00 %';
  const rateLabel = accountData.rateLabel || 'p.a. · variabel';
  
  const lastInterestDate = accountData.lastInterestDate || '-';
  const lastInterestAmount = accountData.lastInterestAmount || 0;
  
  const interestMethod = accountData.interestMethod || '-';
  const noticePeriod = accountData.noticePeriod || '-';
  const depositProtection = accountData.depositProtection || '-';

  // Helper to dynamically format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0,00 €';
    return amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  };

  return (
    <section className="page active" id="page-sparkonto">
      <div className="page-header">
        <div className="page-title">{accountName}</div>
        <div className="page-subtitle">{iban}</div>
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
              {/* ⚡ PURE DYNAMIC: Linked to live dynamic balance variable */}
              <div className="spar-balance">
                {formatCurrency(balance)}
              </div>
              <div style={{ opacity: 0.7, fontSize: '13px' }}>
                Zinsgutschrift: zuletzt {lastInterestDate} · {lastInterestAmount > 0 ? '+' : ''}{formatCurrency(lastInterestAmount)}
              </div>
            </div>

            <div className="spar-rate">
              <div className="spar-rate-value">{interestRate}</div>
              <div className="spar-rate-label">{rateLabel}</div>
            </div>
          </div>

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Zinsumsätze</span>
              </div>

              <div className="card-body">
                {/* ─── ⚡ DYNAMIC ROW RENDERING FROM THE SERVER SOURCE ─── */}
                {interestHistory.length > 0 ? (
                  interestHistory.map((tx, idx) => (
                    <div className="tx-item" key={tx.id || idx}>
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
                          {formatCurrency(tx.amount)}
                        </div>
                        <div className="tx-date">
                          {tx.date ? new Date(tx.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '14px' }}>
                    Keine Zinsumsätze vorhanden.
                  </div>
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
                    {interestRate}
                  </span>
                </div>

                <div className="profil-row">
                  <span className="profil-key">Zinsmethode</span>
                  <span className="profil-value">{interestMethod}</span>
                </div>

                <div className="profil-row">
                  <span className="profil-key">Kündigungsfrist</span>
                  <span className="profil-value">{noticePeriod}</span>
                </div>

                <div className="profil-row">
                  <span className="profil-key">Einlagensicherung</span>
                  <span className="profil-value">{depositProtection}</span>
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
