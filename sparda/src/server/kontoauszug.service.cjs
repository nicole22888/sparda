
const pool = require('../../db.cjs');
const KontoauszugService = {
  
  getTransactionStatementData: async (trackingNumber) => {
    if (!trackingNumber || String(trackingNumber).trim() === '') {
      throw new Error("Missing or invalid tracking number parameter.");
    }

const sqlQuery = `
SELECT
t.tracking_code AS tracking_number,
t.execution_date,
t.amount,
t.recipient_name,
t.purpose,
t.category,
t.type AS tx_type,
u.first_name,
u.last_name,
u.netkey,
u.kundennummer,
b.giro_balance,
b.spar_balance
FROM transactions t
JOIN users u ON t.user_id = u.id
JOIN balances b ON u.id = b.user_id
WHERE LOWER(t.tracking_code) = LOWER($1)
LIMIT 1;
`;

    let dbResult;
    try {
      dbResult = await pool.query(sqlQuery, [trackingNumber.trim()]);
    } catch (dbErr) {
      console.error("❌ CRITICAL DATABASE EXCEPTION // Query execution crashed:", dbErr.message);
      throw new Error("Fehler beim Abrufen der Transaktionsdaten aus der Datenbank.");
    }

    if (dbResult.rows.length === 0) {
      const error = new Error(`Keine Buchungsdaten zur Referenz ${trackingNumber} gefunden.`);
      error.statusCode = 404;
      throw error;
    }
    const dbRow = dbResult.rows[0];

    // ================================================
    //  GERMAN SYSTEM DATA LOCALIZATION & RE-PROCESSING
    // ================================================
    const formatGermanDate = (sqlTimestamp) => {
      const d = new Date(sqlTimestamp);
      if (isNaN(d.getTime())) return "19.08.2026"; 
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}.${month}.${d.getFullYear()}`;
    };

    const currentTransactionAmount = Number(dbRow.amount);
    const resolvedGiroBalance = Number(dbRow.giro_balance);
    let oldBalance = 0;
    let newBalance = 0;

    if (currentTransactionAmount < 0) {
      oldBalance = resolvedGiroBalance + Math.abs(currentTransactionAmount);
      newBalance = resolvedGiroBalance;
    } else {
      oldBalance = resolvedGiroBalance - currentTransactionAmount;
      newBalance = resolvedGiroBalance;
    }

    // Process single-line strings into safe chunks for PDF text-wrapping constraints
    const cleanPurpose = dbRow.purpose || 'Online-Überweisung';
    const purposeLines = [
      cleanPurpose.substring(0, 35).trim(),
      cleanPurpose.substring(35, 70).trim(),
      `Ref-ID: ${dbRow.tracking_number}`
    ].filter(line => line.length > 0);

    const fullAccountName = `${dbRow.first_name} ${dbRow.last_name}`.toUpperCase();

    return {
      bankName: "Sparda-Bank Hessen eG",
      bankAddress: "Klingelhöferstraße 7, 34117 Kassel",
      blz: "500 905 00",
      bic: "HESSDED1KAS",
      
      // Map document number based on the unique database sequence fingerprint
      statementNumber: `2026 / TX-${String(dbRow.kundennummer || '0000')}`,
      creationDate: formatGermanDate(dbRow.execution_date),
      period: `${new Date(dbRow.execution_date).toLocaleString('de-DE', { month: 'long', year: 'numeric' })} (Einzelbuchungsnachweis)`,
      
      accountHolder: fullAccountName,
      accountIban: "DE89 5009 0500 0012 3456 78", 
      
      oldBalance: parseFloat(oldBalance.toFixed(2)),
      newBalance: parseFloat(newBalance.toFixed(2)),
      
      transaction: {
        bookingDate: formatGermanDate(dbRow.execution_date),
        valutaDate: formatGermanDate(dbRow.execution_date), 
        type: dbRow.category === 'Daueraufträge' ? 'Dauerauftrag' : 'SEPA-Überweisung',
        recipientName: dbRow.recipient_name || 'Unbekannt',
        recipientIban: "DE43 2004 0000 9876 5432 10", 
        purposeLines: purposeLines,
        amount: currentTransactionAmount,
        currency: "EUR" 
      }
    };
  }
};

module.exports = KontoauszugService;
