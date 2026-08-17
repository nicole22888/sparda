import { useState } from 'react';
import Navigation from './components/Navigation';
import Header from './components/Header';
import AccountOverview from './components/AccountOverview';
import PageUmsaetze from './components/PageUmsaetze';
import PageUeberweisung from './components/PageUeberweisung';
import PageDauerauftrag from './components/PageDauerauftrag';
import PageDepot from './components/PageDepot';
import PageKarten from './components/PageKarten';
import PagePostfach from './components/PagePostfach';
import PageEinstellungen from './components/PageEinstellungen';
import SecureGoModal from './components/SecureGoModal';
import PageKonto from './components/PageKonto';

export default function App() {
  const [activeTab, setActiveTab] = useState('uebersicht');
  const [secureGoData, setSecureGoData] = useState(null);

  const handleTriggerSecureGo = (data) => {
    setSecureGoData(data);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'uebersicht':
        return <AccountOverview onNavigate={(tab) => setActiveTab(tab)} />;
      case 'umsaetze':
        return <PageUmsaetze />;
      case 'ueberweisung':
        return <PageUeberweisung onTriggerSecureGo={handleTriggerSecureGo} />;
      case 'dauerauftrag':
        return <PageDauerauftrag />;
      case 'depot':
        return <PageDepot />;
      case 'karten':
        return <PageKarten />;
      case 'postfach':
        return <PagePostfach />;
      case 'einstellungen':
        return <PageEinstellungen />;
      default:
        return <AccountOverview onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header activeTab={activeTab} />

        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {renderContent()}
        </main>
      </div>

      {/* SpardaSecureGo+ Overlay Modal */}
      {secureGoData && (
        <SecureGoModal
          transactionData={secureGoData}
          onClose={() => setSecureGoData(null)}
          onSuccess={() => {
            alert('Transaktion erfolgreich freigegeben und übermittelt!');
            setActiveTab('umsaetze');
          }}
        />
      )}
    </div>
  );
}
