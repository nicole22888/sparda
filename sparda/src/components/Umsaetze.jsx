import React, { useState, useEffect } from 'react';

// ─── ⚡ DYNAMIC: ACCEPT INJECTED ACCOUNTS PROP FROM DATABASE ───
function Umsaetze({ goTo, accounts = [] }) {
  const [activeFilter, setActiveFilter] = useState('Alle');
  const [search, setSearch] = useState('');
  
  // ─── DETECT ACTIVE INCOMING TRANSACTION RECORDS ───
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── ⚡ STRICT DATABASE BINDINGS: DYNAMIC ACCOUNT HEADERS ───
  const defaultAccount = accounts.length > 0 ? accounts[0] : null;
  const accountIban = defaultAccount?.iban || '—';
  const accountName = defaultAccount?.name || 'Girokonto';

  useEffect(() => {
    const fetchLedgerHistory = async () => {
      try {
        // Fetch direct transaction list arrays straight from your Node backend routing engine
        const response = await fetch('/api/v1/transfers');
        const data = await response.json();
        
        if (data && data.transactions) {
          setTransactions(data.transactions);
        }
      } catch (err) {
        console.error("SANTOS CORE ENGINE // Ledger query failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLedgerHistory();
  }, []);

  const filters = [
    'Alle',
    'Einnahmen',
    'Ausgaben',
    'Daueraufträge',
    'Lastschriften'
  ];

  // ─── ⚡ TRANSLATE DATA OBJECTS DYNAMICALLY INTO THE GERMAN HIERARCHY ───
  // Processes raw database rows into structured monthly buckets reactively
  const groupedTransactions = transactions.reduce((acc, tx) => {
    const dateObj = new Date(tx.execution_date || tx.date);
    const monthLabel = dateObj.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
    
    // Auto-calculate structural localization parameters
    const isIncome = tx.type === 'income' || tx.amount > 0;
    const formattedAmount = (isIncome ? '+' : '') + tx.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €';
    const formattedDate = dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const sanitizedItem = {
      icon: tx.icon || (isIncome ? '💰' : '🛒'),
      type: tx.type || (isIncome ? 'income' : 'expense'),
      name: tx.recipient_name || tx.name,
      detail: tx.purpose || tx.detail,
      amount: formattedAmount,
      date: formattedDate,
      category: tx.category || (isIncome ? 'Einnahmen' : 'Ausgaben')
    };

    const existingGroup = acc.find(g => g.month === monthLabel);
    if (existingGroup) {
      existingGroup.items.push(sanitizedItem);
    } else {
      acc.push({ month: monthLabel, items: [sanitizedItem] });
    }
    return acc;
  }, []);

  // Filter processing pipeline matches your exact code specifications
  const filteredTransactions = groupedTransactions.map(group => ({
    ...group,
    items: group.items.filter(transaction => {
      const matchesFilter =
        activeFilter === 'Alle' ||
        transaction.category === activeFilter;

      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        transaction.name.toLowerCase().includes(searchValue) ||
        transaction.detail.toLowerCase().includes(searchValue) ||
        transaction.amount.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    })
  })).filter(group => group.items.length > 0);

  return (
    <section className="page active" id="page-umsätze">
      <div className="page-header">
        <div className="page-title">
          Umsätze · {accountName}
        </div>
        {/* ─── ⚡ NO HARDCODING: INJECTS REAL IBAN & ACCOUNT NAME ─── */}
        <div className="page-subtitle">
          {accountIban} · {accountName}
        </div>
      </div>

      <div className="filter-bar">
        {filters.map(filter => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}

        <input
          className="filter-search"
          type="text"
          placeholder="🔍  Suche nach Empfänger, Betrag..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* ─── ⚡ SECURE LOADING SKELETON LAYER ─── */}
      {isLoading && (
        <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)' }}>
          ⌛ Umsätze werden geladen...
        </div>
      )}

      {!isLoading && filteredTransactions.map(group => (
        <div className="month-group" key={group.month}>
          <div className="month-label">
            {group.month}
          </div>

          <div className="card">
            {group.items.map((transaction, index) => (
              <div className="tx-item" key={`${group.month}-${index}`}>
                <div className={`tx-icon ${transaction.type}`}>
                  {transaction.icon}
                </div>

                <div className="tx-info">
                  <div className="tx-name">
                    {transaction.name}
                  </div>
                  <div className="tx-detail">
                    {transaction.detail}
                  </div>
                </div>

                <div className="tx-right">
                  <div className={`tx-amount ${transaction.amount.startsWith('+') ? 'positive' : 'negative'}`}>
                    {transaction.amount}
                  </div>
                  <div className="tx-date">
                    {transaction.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!isLoading && filteredTransactions.length === 0 && (
        <div className="card">
          <div
            className="card-body"
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--gray-500)'
            }}
          >
            Keine Umsätze gefunden.
          </div>
        </div>
      )}
    </section>
  );
}

export default Umsaetze;
