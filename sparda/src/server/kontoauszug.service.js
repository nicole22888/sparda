// Import your existing bulletproof database pool
const pool = require('../../../../db'); 

/**
 * Service layer responsible for pulling transaction data from the database 
 * and sanitizing it into the exact German hierarchical structural format 
 * expected by the PDF generator.
 */
const KontoauszugService = {
  
  getTransactionStatementData: async (trackingNumber) => {
    // Safety check: Ensure a valid tracking number string was passed
    if (!trackingNumber || String(trackingNumber).trim() === '') {
      throw new Error("Missing or invalid tracking number parameter.");
    }

    // =========================================================================
    // 🗄️ THE FUTURE DATABASE ACCESS LAYER
    // =========================================================================
    // When your database tables are ready, simply uncomment this block 
    // and adjust the table or column names to match your schema design.
    /*
    const query = `
      SELECT 
        t.id AS tx_id,
        t.tracking_number,
        t.booking_date,
        t.valuta_date,
        t.amount,
        t.currency,
        t.purpose,
        u.full_name AS sender_name,
        u.iban AS sender_iban,
        u.old_balance,
        u.new_balance
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.tracking_number = $1
      LIMIT 1;
    `;
    const dbResult = await pool.query(query, [trackingNumber.trim()]);
    
    // If database lookup returns empty, throw a safe structural exception
    if (dbResult.rows.length === 0) {
      throw new Error(`No transaction registry found matching ID: ${trackingNumber}`);
    }
    const dbRow = dbResult.rows[0];
    */

    // =========================================================================
    // 🎭 STUB INTERFACE (Placeholder until Database is active)
    // =========================================================================
    // This temporary mock block guarantees your server can boot and test paths 
    // immediately without hardcoding values into the core PDFKit engine.
    console.log(`SANTOS CORE ENGINE // Querying ledger history for tracking ID: ${trackingNumber}`);
    
    const dbRow = {
      tx_id: "REC-2026-88194-SP",
      tracking_number: trackingNumber,
      booking_date: new Date(), // Dynamically falls back to real system timestamp
      valuta_date: new Date(),
      amount: -1250.00, // Negative mapping representing a standard SEPA debit operation
      currency: "EUR",
      purpose: "Logistikgebühren // Transportfracht // Shipment Ref: ST-99823",
      sender_name: "THOMAS MÜLLER",
      sender_iban: "DE89 5009 0500 1234 5678 90",
      old_balance: 2450.00,
      new_balance: 1200.00
    };

    // =========================================================================
    // 🇩🇪 GERMAN HIERARCHY DATA CLEANING & RE-PROCESSING
    // =========================================================================
    // This block standardizes inputs, ensures date structures are localized, 
    // and processes raw multi-line strings into safe arrays for PDF mapping.
    
    const formatDate = (dateObj) => {
      const d = new Date(dateObj);
      if (isNaN(d.getTime())) return "18.08.2026"; // Resilient baseline cutoff fallback
      // Formats to German standard: DD.MM.YYYY
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}.${month}.${d.getFullYear()}`;
    };

    // Splitting a long purpose string into multi-line sub-lines cleanly
    const rawPurpose = dbRow.purpose || 'Umsatzbuchung';
    const purposeLines = [
      rawPurpose.substring(0, 35),
      rawPurpose.substring(35, 70),
      `Ref-ID: ${dbRow.tracking_number}`
    ].filter(line => line.trim() !== '');

    // Return the final data payload directly to the generator
    return {
      bankName: "Sparda-Bank Hessen eG",
      bankAddress: "Klingelhöferstraße 7, 34117 Kassel",
      blz: "500 905 00",
      bic: "HESSDED1KAS",
      
      statementNumber: `2026 / ${String(dbRow.tracking_number).substring(0, 3).toUpperCase() || '001'}`,
      creationDate: formatDate(dbRow.booking_date),
      period: "August 2026 (Umsatzbeleg Einzelbuchung)",
      
      accountHolder: dbRow.sender_name.toUpperCase(),
      accountIban: dbRow.sender_iban,
      
      oldBalance: Number(dbRow.old_balance),
      newBalance: Number(dbRow.new_balance),
      
      transaction: {
        bookingDate: formatDate(dbRow.booking_date),
        valutaDate: formatDate(dbRow.valuta_date),
        type: "SEPA-Überweisung",
        recipientName: "Santos Express Forwarding GmbH",
        recipientIban: "DE43 2004 0000 9876 5432 10",
        purposeLines: purposeLines,
        amount: Number(dbRow.amount),
        currency: dbRow.currency || "EUR"
      }
    };
  }
};

module.exports = KontoauszugService;
