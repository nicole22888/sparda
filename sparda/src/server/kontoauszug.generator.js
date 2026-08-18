const PDFDocument = require('pdfkit');
// Import your new database mapping service
const KontoauszugService = require('./kontoauszug.service'); 

exports.generateOfficialKontoauszugStream = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    // CALL THE DATABASE SERVICE LAYER DYNAMICALLY
    const statement = await KontoauszugService.getTransactionStatementData(trackingNumber);

    // Establish browser response streaming headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=Kontoauszug_Sparda_Hessen.pdf');

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    doc.pipe(res);

    // ─── CORPORATE BRANDING HEADER ───
    doc.rect(40, 40, 20, 20).fill('#2563eb');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(14).text('S', 46, 44);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(16).text('Sparda-Bank', 68, 42);
    doc.fillColor('#64748b').font('Helvetica').fontSize(9).text('Hessen eG', 68, 56);

    // Legal Bank Identifiers
    doc.fillColor('#475569').font('Helvetica').fontSize(8)
       .text(`BIC: ${statement.bic}`, 380, 42, { align: 'right' })
       .text(`BLZ: ${statement.blz}`, 380, 52, { align: 'right' })
       .text(statement.bankAddress, 380, 62, { align: 'right' });

    doc.moveTo(40, 80).lineTo(555, 80).strokeColor('#cbd5e1').lineWidth(1).stroke();

    // ─── TITLE & METADATA GRID ───
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('Kontoauszug / Umsatzbeleg', 40, 95);
    
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

    // ─── BALANCE GRID ───
    doc.moveTo(40, 210).lineTo(555, 210).strokeColor('#0f172a').lineWidth(1).stroke();
    doc.fillColor('#475569').font('Helvetica').fontSize(9).text('Alter Kontostand (Vorsaldo):', 40, 218);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text(`${statement.oldBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`, 400, 218, { align: 'right', width: 155 });
    
    doc.moveTo(40, 232).lineTo(555, 232).strokeColor('#cbd5e1').lineWidth(0.5).stroke();

    // ─── COLUMN HEADERS ───
    let currentY = 248;
    doc.fillColor('#475569').font('Helvetica-Bold').fontSize(8)
       .text('Buchung / Valuta', 40, currentY)
       .text('Begünstigter / Verwendungszweck', 130, currentY)
       .text('Betrag (EUR)', 400, currentY, { align: 'right', width: 155 });

    doc.moveTo(40, 260).lineTo(555, 260).strokeColor('#0f172a').lineWidth(1).stroke();

    // ─── ENTRY ROW COMPILATION BLOCK ───
    currentY = 270;
    const tx = statement.transaction;

    doc.fillColor('#0f172a').font('Helvetica').fontSize(9)
       .text(tx.bookingDate, 40, currentY)
       .text(tx.valutaDate, 40, currentY + 12, { fill: '#64748b' });

    const formattedAmount = tx.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 });
    doc.fillColor('#b91c1c').font('Helvetica-Bold').fontSize(10)
       .text(`${formattedAmount}`, 400, currentY, { align: 'right', width: 155 });

    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text(tx.type, 130, currentY);
    currentY += 12;
    doc.font('Helvetica').fontSize(9).text(`Empfänger: ${tx.recipientName}`, 130, currentY);
    currentY += 12;
    doc.text(`IBAN: ${tx.recipientIban}`, 130, currentY);
    
    currentY += 12;
    tx.purposeLines.forEach((line) => {
      doc.fillColor('#475569').text(line, 130, currentY);
      currentY += 11;
    });

    // ─── CLOSING BALANCE ───
    currentY += 15;
    doc.moveTo(40, currentY).lineTo(555, currentY).strokeColor('#cbd5e1').lineWidth(0.5).stroke();
    
    currentY += 8;
    doc.fillColor('#475569').font('Helvetica').fontSize(9).text('Neuer Kontostand (Nachsaldo):', 40, currentY);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text(`${statement.newBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`, 400, currentY, { align: 'right', width: 155 });

    currentY += 14;
    doc.moveTo(40, currentY).lineTo(555, currentY).strokeColor('#0f172a').lineWidth(1).stroke();

    // ─── COMPLIANCE BLOCKS ───
    currentY += 30;
    doc.rect(40, currentY, 515, 60).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
    doc.fillColor('#64748b').font('Helvetica-Oblique').fontSize(7.5)
       .text('Rechnungsabschluss: Einwendungen gegen diesen Rechnungsabschluss müssen innerhalb von sechs Wochen nach Zugang schriftlich erhoben werden. Das Unterlassen rechtzeitiger Einwendungen gilt als Genehmigung.', 50, currentY + 8, { width: 495, lineGap: 2 });

    // ─── FINAL FOOTER ───
    doc.fillColor('#94a3b8').font('Helvetica').fontSize(8)
       .text('Dieser Kontoauszug wird elektronisch bereitgestellt und ist ohne Unterschrift oder Siegel rechtsgültig.', 40, 740, { align: 'center' })
       .text('Sparda-Bank Hessen eG // Prüfsumme-ID validation layer tracking protocol secured //', 40, 752, { align: 'center' });

    doc.end();

  } catch (err) {
    console.error('Kontoauszug Pipeline Crash:', err);
    return res.status(500).send('Internal German Statement Compilation Error.');
  }
};
