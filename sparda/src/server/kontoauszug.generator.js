const PDFDocument = require('pdfkit');

exports.generateOfficialKontoauszugStream = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    // ─── COMPLETE PROP STRUCTURE EXPECTED BY GERMAN SYSTEM USERS ───
    const statement = {
      bankName: "Sparda-Bank Hessen eG",
      bankAddress: "Klingelhöferstraße 7, 34117 Kassel",
      blz: "500 905 00", // Bankleitzahl (Required German legacy identifier)
      bic: "HESSDED1KAS",
      
      // Document Metadata
      statementNumber: "2026 / 008", // Statements are strictly tracked by sequence number
      creationDate: "18.08.2026",
      period: "August 2026 (Umsatzbeleg Einzelbuchung)",
      
      // Account Holder Properties
      accountHolder: "THOMAS MÜLLER",
      accountIban: "DE89 5009 0500 1234 5678 90",
      
      // Financial Ledger States
      oldBalance: 2450.00,
      newBalance: 1200.00,
      
      // Core Target Transaction Array (German formatting specifications)
      transaction: {
        bookingDate: "18.08.2026", // Buchungstag
        valutaDate: "18.08.2026",  // Wertstellung (Valuta)
        type: "SEPA-Überweisung", // Standard transactional type
        recipientName: "Santos Express Forwarding GmbH",
        recipientIban: "DE43 2004 0000 9876 5432 10",
        purposeLines: [
          "Logistikgebühren // Transportfracht",
          `Ref-ID: ${trackingNumber || "SP-TX-994823-DE"}`,
          "Shipment Ref: ST-99823 // Status: Ausgeführt"
        ],
        amount: -1250.00, // Explicit negative prefix for debits
        currency: "EUR"
      }
    };

    // 1. Establish strict browser binary response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=Kontoauszug_Sparda_Hessen.pdf');

    // 2. Initialize DIN-A4 Structured Canvas Template
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    doc.pipe(res);

    // ─── CORPORATE BRANDING HEADER ───
    doc.rect(40, 40, 20, 20).fill('#2563eb');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(14).text('S', 46, 44);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(16).text('Sparda-Bank', 68, 42);
    doc.fillColor('#64748b').font('Helvetica').fontSize(9).text('Hessen eG', 68, 56);

    // Legal Bank Identifiers (Top Right)
    doc.fillColor('#475569').font('Helvetica').fontSize(8)
       .text(`BIC: ${statement.bic}`, 380, 42, { align: 'right' })
       .text(`BLZ: ${statement.blz}`, 380, 52, { align: 'right' })
       .text(statement.bankAddress, 380, 62, { align: 'right' });

    doc.moveTo(40, 80).lineTo(555, 80).strokeColor('#cbd5e1').lineWidth(1).stroke();

    // ─── DOCUMENT TITLE & METADATA GRID ───
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('Kontoauszug / Umsatzbeleg', 40, 95);
    
    // Metadata Block Columns
    doc.fillColor('#64748b').font('Helvetica').fontSize(9)
       .text(`Auszug-Nr. / Jahr:`, 40, 118)
       .text(`Erstellungsdatum:`, 160, 118)
       .text(`Auszugsperiode:`, 280, 118);

    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9)
       .text(statement.statementNumber, 40, 128)
       .text(statement.creationDate, 160, 128)
       .text(statement.period, 280, 128);

    // ─── ACCOUNT HOLDER IDENTIFICATION CARD ───
    doc.rect(40, 148, 515, 45).fill('#f8fafc');
    doc.fillColor('#475569').font('Helvetica').fontSize(9)
       .text('Kontoinhaber:', 50, 156)
       .text('IBAN:', 50, 172);

    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9)
       .text(statement.accountHolder, 130, 156)
       .text(statement.accountIban, 130, 172);

    // ─── ACCOUNT BALANCE BALANCING MATRICES ───
    doc.moveTo(40, 210).lineTo(555, 210).strokeColor('#0f172a').lineWidth(1).stroke();
    
    doc.fillColor('#475569').font('Helvetica').fontSize(9).text('Alter Kontostand (Vorsaldo):', 40, 218);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text(`${statement.oldBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`, 400, 218, { align: 'right', width: 155 });
    
    doc.moveTo(40, 232).lineTo(555, 232).strokeColor('#cbd5e1').lineWidth(0.5).stroke();

    // ─── OFFICIAL GERMAN TRANSACTION LEDGER COLUMN HEADERS ───
    let currentY = 248;
    doc.fillColor('#475569').font('Helvetica-Bold').fontSize(8)
       .text('Buchung / Valuta', 40, currentY)
       .text('Begünstigter / Verwendungszweck', 130, currentY)
       .text('Betrag (EUR)', 400, currentY, { align: 'right', width: 155 });

    doc.moveTo(40, 260).lineTo(555, 260).strokeColor('#0f172a').lineWidth(1).stroke();

    // ─── ENTRY ROW COMPILATION BLOCK ───
    currentY = 270;
    const tx = statement.transaction;

    // Column 1: Dates
    doc.fillColor('#0f172a').font('Helvetica').fontSize(9)
       .text(tx.bookingDate, 40, currentY)
       .text(tx.valutaDate, 40, currentY + 12, { fill: '#64748b' });

    // Column 3: Amount Financial Formatting (Debits require explicit formatting logic)
    const formattedAmount = tx.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 });
    doc.fillColor('#b91c1c').font('Helvetica-Bold').fontSize(10) // Debits use explicit deep red
       .text(`${formattedAmount}`, 400, currentY, { align: 'right', width: 155 });

    // Column 2: Core Transaction Description Stream
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text(tx.type, 130, currentY);
    currentY += 12;
    doc.font('Helvetica').fontSize(9).text(`Empfänger: ${tx.recipientName}`, 130, currentY);
    currentY += 12;
    doc.text(`IBAN: ${tx.recipientIban}`, 130, currentY);
    
    // Multi-line Verwendungszweck iteration loop processing
    currentY += 12;
    tx.purposeLines.forEach((line) => {
      doc.fillColor('#475569').text(line, 130, currentY);
      currentY += 11;
    });

    // ─── CLOSING BALANCE LEDGER METRIC ───
    currentY += 15;
    doc.moveTo(40, currentY).lineTo(555, currentY).strokeColor('#cbd5e1').lineWidth(0.5).stroke();
    
    currentY += 8;
    doc.fillColor('#475569').font('Helvetica').fontSize(9).text('Neuer Kontostand (Nachsaldo):', 40, currentY);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text(`${statement.newBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`, 400, currentY, { align: 'right', width: 155 });

    currentY += 14;
    doc.moveTo(40, currentY).lineTo(555, currentY).strokeColor('#0f172a').lineWidth(1).stroke();

    // ─── REGULATORY RECONCILIATION COMPLIANCE BLOCKS ───
    currentY += 30;
    doc.rect(40, currentY, 515, 60).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
    
    doc.fillColor('#64748b').font('Helvetica-Oblique').fontSize(7.5)
       .text('Rechnungsabschluss: Einwendungen gegen diesen Rechnungsabschluss müssen innerhalb von sechs Wochen nach Zugang schriftlich erhoben werden. Das Unterlassen rechtzeitiger Einwendungen gilt als Genehmigung.', 50, currentY + 8, { width: 495, lineGap: 2 });

    // ─── FINAL FOOTER ARCHITECTURE ───
    doc.fillColor('#94a3b8').font('Helvetica').fontSize(8)
       .text('Dieser Kontoauszug wird elektronisch bereitgestellt und ist ohne Unterschrift oder Siegel rechtsgültig.', 40, 740, { align: 'center' })
       .text('Sparda-Bank Hessen eG // Prüfsumme-ID validation layer tracking protocol secured //', 40, 752, { align: 'center' });

    // 3. Close data compilation engine threads
    doc.end();

  } catch (err) {
    console.error('Kontoauszug Pipeline Crash:', err);
    return res.status(500).send('Internal German Statement Compilation Error.');
  }
};
