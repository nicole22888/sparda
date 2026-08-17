  
  /*
  import React, { useState } from 'react';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Umsaetze from './components/Umsaetze';
import Ueberweisung from './components/Ueberweisung';
import Dauerauftrag from './components/Dauerauftrag';
import Depot from './components/Depot';
import Sparkonto from './components/Sparkonto';
import Postfach from './components/Postfach';
import Karten from './components/Karten';
import Profil from './components/Profil';

import './components/Login.css';

function App() {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [currentPage, setCurrentPage] = useState('kontoübersicht');

const handleLogin = () => {
setIsLoggedIn(true);
setCurrentPage('kontoübersicht');
};

const handleLogout = () => {
setIsLoggedIn(false);
setCurrentPage('kontoübersicht');
};

const goTo = (page) => {
setCurrentPage(page);
};

const renderPage = () => {
switch (currentPage) {
case 'kontoübersicht':
  return <div style={{ padding: '40px', fontSize: '30px' }}>
  DASHBOARD TEST
  </div>;

case 'umsätze':
return <Umsaetze goTo={goTo} />;

case 'überweisung':
return <Ueberweisung goTo={goTo} />;

case 'dauerauftrag':
return <Dauerauftrag goTo={goTo} />;

case 'depot':
return <Depot goTo={goTo} />;

case 'sparkonto':
return <Sparkonto goTo={goTo} />;

case 'postfach':
return <Postfach goTo={goTo} />;

case 'karten':
return <Karten goTo={goTo} />;

case 'profil':
return <Profil goTo={goTo} />;

default:
return <Dashboard goTo={goTo} />;
}
};

if (!isLoggedIn) {
return (
<Login onLogin={handleLogin} />
);
}

return (
<div id="app">

<header className="app-header">

<div className="app-header-logo">
<div className="logo-icon">
<svg viewBox="0 0 100 100">
<text
y=".9em"
fontSize="80"
fontFamily="serif"
fontWeight="bold"
fill="white"
>
S
</text>
</svg>
</div>

<span className="logo-label">
Sparda-<span>Bank</span>
</span>
</div>

<div className="app-header-main">

<div className="header-greeting">
Guten Tag, <strong>Thomas Müller</strong>
</div>

<div className="header-actions">

<button
className="header-btn mail-btn"
onClick={() => goTo('postfach')}
>
📬 Postfach
<span className="mail-badge">3</span>
</button>

<button className="header-btn">
🔔
</button>

<div
className="header-user"
onClick={() => goTo('profil')}
>
<div className="user-avatar">
TM
</div>

<span className="user-name">
Th. Müller
</span>

<span
style={{
color: 'var(--gray-400)',
fontSize: '10px'
}}
>
▾
</span>
</div>

<button
className="header-btn"
onClick={handleLogout}
style={{
borderColor: 'var(--red)',
color: 'var(--red)'
}}
>
⏏ Abmelden
</button>

</div>
</div>
</header>


<nav className="app-sidebar">

<div className="sidebar-section">

<div className="sidebar-section-title">
Konten
</div>

<button
className={`sidebar-item ${
currentPage === 'kontoübersicht' ? 'active' : ''
}`}
onClick={() => goTo('kontoübersicht')}
>
<span className="sidebar-item-icon">
🏠
</span>

Kontoübersicht
</button>

<button
className={`sidebar-item ${
currentPage === 'umsätze' ? 'active' : ''
}`}
onClick={() => goTo('umsätze')}
>
<span className="sidebar-item-icon">
📋
</span>

Umsätze
</button>

</div>


<hr className="sidebar-divider" />


<div className="sidebar-section">

<div className="sidebar-section-title">
Zahlungsverkehr
</div>

<button
className={`sidebar-item ${
currentPage === 'überweisung' ? 'active' : ''
}`}
onClick={() => goTo('überweisung')}
>
<span className="sidebar-item-icon">
↗️
</span>

Überweisung
</button>

<button
className={`sidebar-item ${
currentPage === 'dauerauftrag' ? 'active' : ''
}`}
onClick={() => goTo('dauerauftrag')}
>
<span className="sidebar-item-icon">
🔄
</span>

Dauerauftrag
</button>

</div>


<hr className="sidebar-divider" />


<div className="sidebar-section">

<div className="sidebar-section-title">
Anlage & Depot
</div>

<button
className={`sidebar-item ${
currentPage === 'depot' ? 'active' : ''
}`}
onClick={() => goTo('depot')}
>
<span className="sidebar-item-icon">
📈
</span>

UnionDepot
</button>

<button
className={`sidebar-item ${
currentPage === 'sparkonto' ? 'active' : ''
}`}
onClick={() => goTo('sparkonto')}
>
<span className="sidebar-item-icon">
🐷
</span>

SpardaSpar
</button>

</div>


<hr className="sidebar-divider" />


<div className="sidebar-section">

<div className="sidebar-section-title">
Service
</div>

<button
className={`sidebar-item ${
currentPage === 'postfach' ? 'active' : ''
}`}
onClick={() => goTo('postfach')}
>
<span className="sidebar-item-icon">
📬
</span>

Postfach

<span className="sidebar-item-badge">
3
</span>
</button>

<button
className={`sidebar-item ${
currentPage === 'karten' ? 'active' : ''
}`}
onClick={() => goTo('karten')}
>
<span className="sidebar-item-icon">
💳
</span>

Meine Karten
</button>

<button
className={`sidebar-item ${
currentPage === 'profil' ? 'active' : ''
}`}
onClick={() => goTo('profil')}
>
<span className="sidebar-item-icon">
👤
</span>

Profil & Sicherheit
</button>

</div>

</nav>


<main className="app-main">
{renderPage()}
</main>

</div>
);
}

export default App;
*/
