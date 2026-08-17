import { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import Header from './components/Header';
import PageKonto from './components/PageKonto';
import PageUmsaetze from './components/PageUmsaetze';
import PageUeberweisung from './components/PageUeberweisung';
import PageDauerauftrag from './components/PageDauerauftrag';
import PageDepot from './components/PageDepot';
import PageKarten from './components/PageKarten';
import PagePostfach from './components/PagePostfach';
import PageEinstellungen from './components/PageEinstellungen';
import SecureGoModal from './components/SecureGoModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('uebersicht');
  const [secureGoData, setSecureGoData] = useState(null);

  // Normalize tab key so both 'konto' and 'uebersicht' map uniformly
  const normalizedTab = useMemo(() => {
    if (activeTab === 'konto' || activeTab === 'overview') return 'uebersicht';
    return activeTab;
  }, [activeTab]);

  const handleNavigate = (tab) => {
    if (tab === 'konto' || tab === 'overview') {
      setActiveTab('uebersicht');
    } else {
      setActiveTab(tab);
    }
  };

  const handleTriggerSecureGo = (data) => setSecureGoData(data);

  const renderContent = () => {
    switch (normalizedTab) {
      case 'uebersicht':
        return <PageKonto onNavigate={handleNavigate} />;
      case 'umsaetze':
        return <PageUmsaetze onNavigate={handleNavigate} />;
      case 'ueberweisung':
        return <PageUeberweisung onTriggerSecureGo={handleTriggerSecureGo} onNavigate={handleNavigate} />;
      case 'dauerauftrag':
        return <PageDauerauftrag onNavigate={handleNavigate} />;
      case 'depot':
        return <PageDepot onNavigate={handleNavigate} />;
      case 'karten':
        return <PageKarten onNavigate={handleNavigate} />;
      case 'postfach':
        return <PagePostfach onNavigate={handleNavigate} />;
      case 'einstellungen':
        return <PageEinstellungen onNavigate={handleNavigate} />;
      default:
        return <PageKonto onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navigation activeTab={normalizedTab} setActiveTab={handleNavigate} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header activeTab={normalizedTab} onNavigate={handleNavigate} />

        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {renderContent()}
        </main>
      </div>

      {secureGoData && (
        <SecureGoModal
          transactionData={secureGoData}
          onClose={() => setSecureGoData(null)}
          onSuccess={() => {
            alert('Transaktion erfolgreich freigegeben und übermittelt!');
            setSecureGoData(null);
            handleNavigate('umsaetze');
          }}
        />
      )}
    </div>
  );
}
