import React, { useState, useEffect } from 'react';

function Postfach({ user }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Transaction Tracking States
  const [activeTrackingNumber, setActiveTrackingNumber] = useState(null);
  const [selectedMail, setSelectedMail] = useState(0);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/v1/user/messages');
        const data = await response.json();
        
        if (data && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Mailbox sync failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    // Parses current browser URL parameters cleanly to capture our dynamic route parameters
    const params = new URLSearchParams(window.location.search);
    const tracking = params.get('trackingNumber');
    
    if (tracking) {
      setActiveTrackingNumber(tracking);
      // Automatically focus on our fresh transaction statement mail entry if it exists
      setSelectedMail(-1); 
    }
  }, []);

  const showMail = (idx) => {
    setSelectedMail(idx);
  };

  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();

  // Dynamically calculate total unread messages (Database unread + possible live transaction receipt)
  const unreadCount = messages.filter(m => m.is_unread).length + (activeTrackingNumber ? 1 : 0);

  // Resolve active message content block dynamically based on index parameter boundaries
  const isDynamicMailSelected = selectedMail === -1 && activeTrackingNumber;
  
  const activeMail = isDynamicMailSelected 
    ? {
        subject: `📄 Umsatzbeleg Einzelbuchung (${activeTrackingNumber})`,
        meta: `Von: Sparda-Bank · An: ${fullName} · Heute · Live-Systembeleg`,
        body: null // Will be handled inside our visual render sandbox override below
      }
    : messages[selectedMail] || {};

  const livePdfStreamUrl = activeTrackingNumber 
    ? `/api/v1/sparda/kontoauszug/${activeTrackingNumber}`
    : '';

  return (
    <section className="page active" id="page-postfach">
      <div className="page-header">
        <div className="page-title">Postfach</div>
        {/* dynamic interpolation for unread counts */}
        <div className="page-subtitle">{unreadCount} ungelesene Nachrichten</div>
      </div>

      <div className="postfach-layout">
        <div className="mail-list-panel">
          <div className="card-header">
            <span className="card-title">Nachrichten</span>
          </div>

          {isLoading ? (
             <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '14px' }}>
               ⌛ Nachrichten werden geladen...
             </div>
          ) : (
            <>
              {/* ──FRESH TRANSACTION ACCOUNTING STATEMENT ENTRY ─── */}
              {activeTrackingNumber && (
                <div
                  className={`mail-list-item unread ${selectedMail === -1 ? 'selected' : ''}`}
                  onClick={() => showMail(-1)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="mail-list-subject" style={{ color: 'var(--blue)', fontWeight: '700' }}>
                      📄 Neu: Umsatzbeleg Online-Buchung
                    </div>
                    <div className="mail-unread-dot" style={{ background: 'var(--blue)' }}></div>
                  </div>
                  <div className="mail-list-preview">
                    Bestätigung Ihrer soeben ausgeführten SEPA-Überweisung...
                  </div>
                  <div className="mail-list-date">Heute</div>
                </div>
              )}

              {/* ───ITERATE DATABASE MESSAGES ─── */}
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className={`mail-list-item ${msg.is_unread ? 'unread' : ''} ${selectedMail === idx ? 'selected' : ''}`}
                  onClick={() => showMail(idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="mail-list-subject">{msg.subject}</div>
                    {msg.is_unread && <div className="mail-unread-dot"></div>}
                  </div>
                  <div className="mail-list-preview">
                    {msg.preview}
                  </div>
                  <div className="mail-list-date">{msg.date}</div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mail-detail-panel" id="mail-detail">
          {!isLoading && Object.keys(activeMail).length > 0 && (
            <>
              <div className="mail-detail-subject">
                {activeMail.subject}
              </div>

              <div className="mail-detail-meta">
                {/* Fallback formatting if the backend doesn't provide a pre-formatted meta string */}
                {activeMail.meta || `Von: ${activeMail.sender || 'Sparda-Bank'} · An: ${fullName} · ${activeMail.date}`}
              </div>

              <div className="mail-detail-body" style={{ height: isDynamicMailSelected ? '100%' : 'auto' }}>
                {/* ─── IFRAME CONTAINER AUTO-INJECTION ENGINE ─── */}
                {isDynamicMailSelected ? (
                  <div style={{ width: '100%', height: '520px', marginTop: '10px' }}>
                    <iframe
                      src={livePdfStreamUrl}
                      title="Sparda Kontoauszug PDF Stream"
                      width="100%"
                      height="100%"
                      style={{
                        border: '1px solid var(--gray-200)',
                        borderRadius: '6px',
                        background: '#f8fafc'
                      }}
                    />
                  </div>
                ) : (
                  /*Safely injects HTML bodies sent from the backend (like paragraphs and bold tags) */
                  <div dangerouslySetInnerHTML={{ __html: activeMail.body }} />
                )}

                <div style={{ marginTop: '20px' }}>
                  {/* ───ACCESSIBLE ANCHOR DOWNSTREAM PIPELINE LINK ─── */}
                  {isDynamicMailSelected ? (
                    <a
                      href={livePdfStreamUrl}
                      download={`Kontoauszug_${activeTrackingNumber}.pdf`}
                      className="btn-primary"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      ⬇ PDF herunterladen
                    </a>
                  ) : (
                    <button className="btn-primary">⬇ PDF herunterladen</button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Postfach;
