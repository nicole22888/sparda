import React, { useState } from 'react';

function Umsaetze({ goTo }) {
const [activeFilter, setActiveFilter] = useState('Alle');
const [search, setSearch] = useState('');

const filters = [
'Alle',
'Einnahmen',
'Ausgaben',
'Daueraufträge',
'Lastschriften'
];

const transactions = [
{
month: 'März 2026',
items: [
{
icon: '💰',
type: 'income',
name: 'Gehaltseingang Siemens AG',
detail: 'Gehalt März 2026 · SEPA-Überweisung',
amount: '+3.200,00 €',
date: '07.03.2026',
category: 'Einnahmen'
},
{
icon: '🛒',
type: 'expense',
name: 'REWE Kaufpark München',
detail: 'Kartenzahlung · Girocard · Terminal 4812',
amount: '-94,38 €',
date: '06.03.2026',
category: 'Ausgaben'
},
{
icon: '☕',
type: 'expense',
name: 'Starbucks Coffee München Hbf',
detail: 'Kartenzahlung · Girocard',
amount: '-7,90 €',
date: '05.03.2026',
category: 'Ausgaben'
},
{
icon: '🏠',
type: 'expense',
name: 'Hausverwaltung GmbH · Miete',
detail: 'Dauerauftrag · IBAN: DE12 7009 0500 9988...',
amount: '-950,00 €',
date: '01.03.2026',
category: 'Daueraufträge'
},
{
icon: '🔁',
type: 'transfer',
name: 'Eigene Umbuchung · SpardaSpar',
detail: 'Sparkonto Aufstockung',
amount: '-500,00 €',
date: '01.03.2026',
category: 'Daueraufträge'
}
]
},
{
month: 'Februar 2026',
items: [
{
icon: '⚡',
type: 'expense',
name: 'E.ON Energie Deutschland · Strom',
detail: 'Lastschrift · Kd-Nr. 4728812',
amount: '-87,00 €',
date: '28.02.2026',
category: 'Lastschriften'
},
{
icon: '💸',
type: 'income',
name: 'Zinsgutschrift SpardaSpar Flex',
detail: 'Monatliche Zinsen · 2,5 % p.a.',
amount: '+31,75 €',
date: '28.02.2026',
category: 'Einnahmen'
},
{
icon: '🎬',
type: 'expense',
name: 'Netflix International BV',
detail: 'Lastschrift · Abo Standard',
amount: '-17,99 €',
date: '27.02.2026',
category: 'Lastschriften'
},
{
icon: '🚗',
type: 'expense',
name: 'Aral Tankstelle München West',
detail: 'Kartenzahlung · Mastercard Gold',
amount: '-68,50 €',
date: '25.02.2026',
category: 'Ausgaben'
},
{
icon: '💰',
type: 'income',
name: 'Gehaltseingang Siemens AG',
detail: 'Gehalt Februar 2026 · SEPA-Überweisung',
amount: '+3.200,00 €',
date: '07.02.2026',
category: 'Einnahmen'
},
{
icon: '🏠',
type: 'expense',
name: 'Hausverwaltung GmbH · Miete',
detail: 'Dauerauftrag',
amount: '-950,00 €',
date: '01.02.2026',
category: 'Daueraufträge'
},
{
icon: '📱',
type: 'expense',
name: 'Telekom Deutschland GmbH',
detail: 'Lastschrift · Mobilfunk MagentaMobil',
amount: '-39,95 €',
date: '01.02.2026',
category: 'Lastschriften'
}
]
}
];

const filteredTransactions = transactions.map(group => ({
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
Umsätze · Girokonto
</div>

<div className="page-subtitle">
DE89 7009 0500 0012 3456 78 · SpardaGiro Klassik
</div>

</div>


<div className="filter-bar">

{filters.map(filter => (
<button
key={filter}
className={`filter-btn ${
activeFilter === filter ? 'active' : ''
}`}
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


{filteredTransactions.map(group => (

<div
className="month-group"
key={group.month}
>

<div className="month-label">
{group.month}
</div>


<div className="card">

{group.items.map((transaction, index) => (

<div
className="tx-item"
key={`${group.month}-${index}`}
>

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

<div
className={`tx-amount ${
transaction.amount.startsWith('+')
? 'positive'
: 'negative'
}`}
>
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


{filteredTransactions.length === 0 && (

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
