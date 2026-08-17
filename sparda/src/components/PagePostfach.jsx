import { useState } from 'react';

export default function PagePostfach() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Kontoauszug August 2026',
      category: 'Kontoauszüge',
      date: '01.08.2026',
      unread: true,
      size: '245 KB',
      content: 'Ihr monatlicher Kontoauszug für das SpardaGiro Classic Konto DE89 3006 0010 0001 2345 67 steht bereit.'
    },
    {
      id: 2,
      title: 'Jahressteuerbescheinigung 2025',
      category: 'Steuerbescheinigungen',
      date: '15.03.2026',
      unread: false,
      size: '1.2 MB',
      content: 'Ihre Jahressteuerbescheinigung gemäß § 45a Abs. 2 EStG für das Kalenderjahr 2025.'
    },
    {
      id: 3,
      title: 'Abrechnung UnionDepot Q2/2026',
      category: 'Wertpapiere',
      date: '30.06.2026',
      unread: false,
      size: '512 KB',
      content: 'Quartalsabrechnung für Ihr UnionDepot 5501 9823 10.'
    },
    {
      id: 4,
      title: 'Änderung der Allgemeinen Geschäftsbedingungen (AGB)',
      category: 'Bankmitteilungen',
      date: '10.05.2026',
      unread: true,
      size: '890 KB',
      content: 'Wichtige Informationen zu den Aktualisierungen unserer Sonderbedingungen für das Online-Banking.'
    }
  ]);

  const toggleReadStatus = (id) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, unread: false } : doc))
    );
  };

  const handleSelectDoc = (doc) => {
    toggleReadStatus(doc.id);
    setSelectedDoc(doc);
  };

  return (
    <div className="page-postfach">
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0a192f' }}>Elektronisches Postfach</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Kontoauszüge, Steuerdokumente und verschlüsselte Mitteilungen Ihrer Sparda-Bank
          </p>
        </div>
        <button
          onClick={() => alert('Neue Nachricht an den Kundenservice verfassen.')}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: '#003A70', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ✉️ Nachricht schreiben
        </button>
      </div>

      {/* Postbox Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('inbox')}
          style={{
            padding: '0.75rem 1rem',
            border: 'none',
            borderBottom: activeTab === 'inbox' ? '3px solid #003A70' : '3px solid transparent',
            backgroundColor: 'transparent',
            fontWeight: activeTab === 'inbox' ? 'bold' : 'normal',
            color: activeTab === 'inbox' ? '#003A70' : '#64748b',
            cursor: 'pointer'
          }}
        >
          Posteingang ({documents.filter((d) => d.unread).length} ungelesen)
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          style={{
            padding: '0.75rem 1rem',
            border: 'none',
            borderBottom: activeTab === 'archive' ? '3px solid #003A70' : '3px solid transparent',
            backgroundColor: 'transparent',
            fontWeight: activeTab === 'archive' ? 'bold' : 'normal',
            color: activeTab === 'archive' ? '#003A70' : '#64748b',
            cursor: 'pointer'
          }}
        >
          Archiv
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Document List */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleSelectDoc(doc)}
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: selectedDoc?.id === doc.id ? '#f0f9ff' : doc.unread ? '#f8fafc' : '#fff',
                cursor: 'pointer',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{doc.unread ? '📩' : '📄'}</span>
                <div>
                  <div style={{ fontWeight: doc.unread ? 'bold' : '500', color: '#0f172a', fontSize: '0.95rem' }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                    {doc.category} • {doc.size}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {doc.date}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Document Preview Panel */}
        {selectedDoc && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', position: 'relative' }}>
            <button
              onClick={() => setSelectedDoc(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#64748b' }}
            >
              ✕
            </button>
            <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {selectedDoc.category}
            </span>
            <h2 style={{ fontSize: '1.2rem', margin: '0.75rem 0 0.25rem 0', color: '#0f172a' }}>{selectedDoc.title}</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>Datum: {selectedDoc.date}</p>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', minHeight: '120px', fontSize: '0.9rem', color: '#334155' }}>
              {selectedDoc.content}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => alert(`Download gestartet: ${selectedDoc.title}.pdf`)}
                style={{ flex: 1, padding: '0.6rem', backgroundColor: '#003A70', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                📥 PDF Herunterladen
              </button>
              <button
                onClick={() => alert('Dokument im Archiv gespeichert.')}
                style={{ padding: '0.6rem 1rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                📁 Archivieren
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
