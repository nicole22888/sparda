export default function Header({ activeTab }) {
  const titles = {
    uebersicht: 'Finanzübersicht',
    umsaetze: 'Umsätze & Suche',
    ueberweisung: 'Überweisung',
    dauerauftrag: 'Daueraufträge',
    depot: 'UnionDepot Portfolio',
    karten: 'Kartenverwaltung',
    postfach: 'Elektronisches Postfach',
    einstellungen: 'Einstellungen'
  };

  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a' }}>
        {titles[activeTab] || 'Online-Banking'}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Letzter Login: <span style={{ color: '#0f172a', fontWeight: '500' }}>Heute, 16:42 Uhr</span>
        </div>
        <button
          onClick={() => alert('Sie wurden erfolgreich abgemeldet.')}
          style={{ padding: '0.4rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', color: '#dc2626', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Abmelden 🔒
        </button>
      </div>
    </header>
  );
}
