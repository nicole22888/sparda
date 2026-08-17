export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'uebersicht', label: 'Übersicht', icon: '📊' },
    { id: 'umsaetze', label: 'Umsätze', icon: '💳' },
    { id: 'ueberweisung', label: 'Überweisung', icon: '💸' },
    { id: 'dauerauftrag', label: 'Dauerauftrag', icon: '🔄' },
    { id: 'depot', label: 'UnionDepot', icon: '📈' },
    { id: 'karten', label: 'Karten', icon: '🪪' },
    { id: 'postfach', label: 'Postfach', icon: '📬' },
    { id: 'einstellungen', label: 'Einstellungen', icon: '⚙️' },
  ];

  return (
    <aside style={{ width: '240px', backgroundColor: '#0a192f', color: '#fff', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
        <div style={{ backgroundColor: '#003A70', color: '#fff', fontWeight: 'bold', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '1.1rem' }}>S</div>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.5px' }}>SpardaBanking</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? '#003A70' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
