import React, { useState, useEffect } from 'react';

const mailContents = [
  {
    subject: '📄 Kontoauszug Februar 2026',
    meta: 'Von: Sparda-Bank München eG · An: Thomas Müller · 08.03.2026 · 07:42 Uhr',
    body: (
      <>
        <p>Sehr geehrter Herr Müller,</p>
        <br />
        <p>
          Ihr Kontoauszug für das Girokonto <strong>DE89 7009 0500 0012 3456 78</strong> für den Monat <strong>Februar 2026</strong> steht zur Verfügung.
        </p>
        <br />
        <p>
          <strong>Zusammenfassung:</strong>
          <br />
          Anfangssaldo: 1.195,45 €
          <br />
          Einnahmen: +3.231,75 €
          <br />
          Ausgaben: −1.595,27 €
          <br />
          Endsaldo: 2.831,93 €
        </p>
        <br />
        <p>
          Mit freundlichen Grüßen
          <br />
          <strong>Ihre Sparda-Bank München eG</strong>
        </p>
      </>
    )
  },
  {
    subject: '🔐 SpardaSecureGo+ erfolgreich aktiviert',
    meta: 'Von: Sparda-Bank München eG · An: Thomas Müller · 06.03.2026 · 14:18 Uhr',
    body: (
      <>
        <p>Sehr geehrter Herr Müller,</p>
        <br />
        <p>
          Ihr Gerät <strong>iPhone 14 Pro</strong> wurde erfolgreich für SpardaSecureGo+ registriert.
        </p>
        <br />
        <p>
          Falls Sie diese Aktion nicht selbst durchgeführt haben, kontaktieren Sie uns umgehend unter <strong>089 / 55142-0</strong>.
        </p>
        <br />
        <p>
          Mit freundlichen Grüßen
          <br />
          <strong>Ihre Sparda-Bank München eG</strong>
        </p>
      </>
    )
  },
  {
    subject: '⚠️ Wichtige Mitteilung: Verification of Payee',
    meta: 'Von: Sparda-Bank München eG · An: Thomas Müller · 01.03.2026 · 09:00 Uhr',
    body: (
      <>
        <p>Sehr geehrter Herr Müller,</p>
        <br />
        <p>
          Ab dem <strong>9. Oktober 2025</strong> wird bei jeder SEPA-Überweisung innerhalb des EWR automatisch geprüft, ob der Name des Empfängers zur angegebenen IBAN passt (Verification of Payee / VoP).
        </p>
        <br />
        <p>
          Dies erhöht den Schutz vor Betrug und Fehlüberweisungen.
        </p>
        <br />
        <p>
          Mit freundlichen Grüßen
          <br />
          <strong>Ihre Sparda-Bank München eG</strong>
        </p>
      </>
    )
  },
  {
    subject: '📊 Depotabrechnung Q4 2025',
    meta: 'Von: Union Investment · An: Thomas Müller · 15.01.2026 · 06:00 Uhr',
    body: (
      <>
        <p>Sehr geehrter Herr Müller,</p>
        <br />
        <p>
          Ihre Depotabrechnung für das 4. Quartal 2025 ist verfügbar. Ihr Depotwert zum 31.12.2025 betrug <strong>36.640,00 €</strong>.
        </p>
        <br />
        <p>
          Mit freundlichen Grüßen
          <br />
          <strong>Union Investment</strong>
        </p>
      </>
    )
  },
  {
    subject: '📋 Jahreskontoauszug 2025',
    meta: 'Von: Sparda-Bank München eG · An: Thomas Müller · 05.01.2026 · 07:00 Uhr',
    body: (
      <>
        <p>Sehr geehrter Herr Müller,</p>
        <br />
        <p>
          Ihr Jahreskontoauszug für das Jahr <strong>2025</strong> steht zum Download bereit.
        </p>
        <br />
        <p>
          Mit freundlichen Grüßen
          <br />
          <strong>Ihre Sparda-Bank München eG</strong>
        </p>
      </>
    )
  }
];

function Postfach() {
  // ─── ⚡ NEW: DETECT ACTIVE INCOMING TRANSACTION PAYLOADS ───
  const [activeTrackingNumber, setActiveTrackingNumber] = useState(null);
  const [selectedMail, setSelectedMail] = useState(0);

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

  // Resolve active message content block dynamically based on index parameter boundaries
  const isDynamicMailSelected = selectedMail === -1 && activeTrackingNumber;
  
  const mail = isDynamicMailSelected 
    ? {
        subject: `📄 Umsatzbeleg Einzelbuchung (${activeTrackingNumber})`,
        meta: `Von: Sparda-Bank Hessen eG · An: Thomas Müller · Heute · Live-Systembeleg`,
        body: null // Will be handled inside our visual render sandbox override below
      }
    : mailContents[selectedMail] || mailContents[0];

  // Dynamic API endpoint construction targeting your express router file module
  const livePdfStreamUrl = activeTrackingNumber 
    ? `/api/v1/sparda/kontoauszug/${activeTrackingNumber}`
    : '';

  return (
    <section className="page active" id="page-postfach">
      <div className="page-header">
        <div className="page-title">Postfach</div>
        {/* ⚡ UPDATED: Dynamically scales unread text based on extra message state injections */}
        <div className="page-subtitle">{activeTrackingNumber ? '4' : '3'} ungelesene Nachrichten</div>
      </div>

      <div className="postfach-layout">
        <div className="mail-list-panel">
          <div className="card-header">
            <span className="card-title">Nachrichten</span>
          </div>

          {/* ─── ⚡ NEW: DYNAMIC FRESH TRANSACTION ACCOUNTING STATEMENT ENTRY ─── */}
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

          <div
            className={`mail-list-item unread ${selectedMail === 0 ? 'selected' : ''}`}
            onClick={() => showMail(0)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="mail-list-subject">Kontoauszug Februar 2026</div>
              <div className="mail-unread-dot"></div>
            </div>
            <div className="mail-list-preview">
              Ihr monatlicher Kontoauszug steht bereit...
            </div>
            <div className="mail-list-date">08.03.2026</div>
          </div>

          <div
            className={`mail-list-item unread ${selectedMail === 1 ? 'selected' : ''}`}
            onClick={() => showMail(1)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="mail-list-subject">SpardaSecureGo+ aktiviert</div>
              <div className="mail-unread-dot"></div>
            </div>
            <div className="mail-list-preview">
              Ihr neues Gerät wurde erfolgreich...
            </div>
            <div className="mail-list-date">06.03.2026</div>
          </div>

          <div
            className={`mail-list-item unread ${selectedMail === 2 ? 'selected' : ''}`}
            onClick={() => showMail(2)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="mail-list-subject">Wichtige Mitteilung: VoP</div>
              <div className="mail-unread-dot"></div>
            </div>
            <div className="mail-list-preview">
              Ab 9. Oktober automatische...
            </div>
            <div className="mail-list-date">01.03.2026</div>
          </div>

          <div
            className={`mail-list-item ${selectedMail === 3 ? 'selected' : ''}`}
            onClick={() => showMail(3)}
          >
            <div className="mail-list-subject">Depotabrechnung Q4 2025</div>
            <div className="mail-list-preview">
              Ihre UnionDepot-Abrechnung...
            </div>
            <div className="mail-list-date">15.01.2026</div>
          </div>

          <div
            className={`mail-list-item ${selectedMail === 4 ? 'selected' : ''}`}
            onClick={() => showMail(4)}
          >
            <div className="mail-list-subject">Jahreskontoauszug 2025</div>
            <div className="mail-list-preview">
              Ihr Jahreskontoauszug 2025 ist verfügbar...
            </div>
            <div className="mail-list-date">05.01.2026</div>
          </div>
        </div>

        <div className="mail-detail-panel" id="mail-detail">
          <div className="mail-detail-subject">
            {mail.subject}
          </div>

          <div className="mail-detail-meta">
            {mail.meta}
          </div>

          <div className="mail-detail-body" style={{ height: isDynamicMailSelected ? '100%' : 'auto' }}>
            {/* ─── ⚡ FIXED: IFRAME CONTAINER AUTO-INJECTION ENGINE ─── */}
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
              mail.body
            )}

            <div style={{ marginTop: '20px' }}>
              {/* ─── ⚡ FIXED: ACCESSIBLE ANCHOR DOWNSTREAM PIPELINE LINK ─── */}
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
        </div>
      </div>
    </section>
  );
}

export default Postfach;
