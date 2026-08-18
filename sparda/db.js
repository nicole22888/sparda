const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Ensure your .env contains your secret cloud URL parameter:
// DATABASE_URL=postgresql://postgres:[password]@://supabase.com
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ CRITICAL INITIALIZATION ERROR // Missing DATABASE_URL environment variable.");
  process.exit(1);
}

// Direct connection pool architecture configurations
const pool = new Pool({
  connectionString: connectionString,
  max: 10,                           // Maximum active client connections allowed concurrently
  idleTimeoutMillis: 30000,          // Automatically close inactive clients after 30 seconds
  connectionTimeoutMillis: 5000,     // Drop connection handshake attempts if server times out past 5 seconds
  ssl: { rejectUnauthorized: false } // Mandatory SSL restriction rule to isolate cloud nodes securely
});

/**
 * Robust database initialization engine.
 * Connects to Supabase, checks for initial data rows, and seeds Thomas Müller's 
 * profile, starting balances, and ledger histories automatically on first boot.
 */
const initializeDatabaseEngine = async (retries = 5, delay = 3000) => {
  while (retries) {
    let client = null;
    try {
      console.log(`🇩🇪 SPARDA CORE ENGINE // Connecting to Supabase pool... (Attempts left: ${retries})`);
      client = await pool.connect();
      console.log("🇩🇪 SPARDA CORE ENGINE // Handshake verified. Cloud network socket active.");

      // =========================================================================
      // 🚀 SEEDING OPERATION: THE CORE BANK USER SETUP
      // =========================================================================
      // Check if our target test profile user exists inside the database
      const userCheck = await client.query("SELECT id FROM users WHERE netkey = $1 LIMIT 1", ['Sparda1234512.05.85']);
      
      let userId;

      if (userCheck.rows.length === 0) {
        console.log("🇩🇪 SPARDA CORE ENGINE // Target user profile missing. Initiating seeding sequence...");
        
        // Wrap seeding operations inside an isolated SQL transaction boundary
        await client.query('BEGIN');

        // 1. Hash the 6-digit Online-PIN credential securely using bcrypt
        const pinHash = await bcrypt.hash('123456', 10);

        // 2. Insert Thomas Müller into the users table
        const userInsert = await client.query(`
          INSERT INTO users (
            netkey, pin_hash, first_name, last_name, geburtsdatum, 
            steuer_id, adresse, telefon, email, kundennummer, mitglied_seit
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id;
        `, [
          'Sparda1234512.05.85', pinHash, 'Thomas', 'Müller', '1985-05-12',
          '14 123 456 789', 'Maximilianstr. 42, 80539 München', '+49 176 123456789',
          't.mueller@email.de', '123456', 2011
        ]);

        userId = userInsert.rows[0].id;

        // 3. Initialize Starting Balancing Tofels (Matching your UI specifications)
        await client.query(`
          INSERT INTO balances (
            user_id, giro_balance, spar_balance, depot_value, depot_cost_basis
          ) VALUES ($1, $2, $3, $4, $5);
        `, [userId, 2847.93, 15240.00, 38412.75, 36600.00]);

        // 4. Populate Core Ledger History (Umsaetze)
        const initialTransactions = [
          ['SP-TX-INIT-01', '2026-03-07 07:42:00+00', 3200.00, 'income', 'Gehaltseingang Siemens AG', 'Gehalt März 2026 · SEPA-Überweisung', 'Einnahmen', '💰'],
          ['SP-TX-INIT-02', '2026-03-06 12:30:00+00', -94.38, 'expense', 'REWE Kaufpark München', 'Kartenzahlung · Girocard · Terminal 4812', 'Ausgaben', '🛒'],
          ['SP-TX-INIT-03', '2026-03-05 15:10:00+00', -7.90, 'expense', 'Starbucks Coffee München Hbf', 'Kartenzahlung · Girocard', 'Ausgaben', '☕'],
          ['SP-TX-INIT-04', '2026-03-01 00:01:00+00', -950.00, 'expense', 'Hausverwaltung GmbH · Miete', 'Dauerauftrag · IBAN: DE12 7009 0500 9988...', 'Daueraufträge', '🏠'],
          ['SP-TX-INIT-05', '2026-03-01 00:05:00+00', -500.00, 'transfer', 'Eigene Umbuchung · SpardaSpar', 'Sparkonto Aufstockung', 'Daueraufträge', '🔁']
        ];

        for (const tx of initialTransactions) {
          await client.query(`
            INSERT INTO transactions (
              user_id, tracking_number, execution_date, amount, type, recipient_name, purpose, category, icon
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
          `, [userId, ...tx]);
        }

        // 5. Populate Savings History (Sparkonto)
        const initialSavings = [
          ['Zinsgutschrift', '2,5 % p.a. · Feb 2026', 31.75, '2026-02-28', 'income', '💸'],
          ['Zinsgutschrift', '2,5 % p.a. · Jan 2026', 29.88, '2026-01-31', 'income', '💸'],
          ['Einzahlung vom Girokonto', 'Sparrate März', 500.00, '2026-03-01', 'transfer', '🔁']
        ];

        for (const sv of initialSavings) {
          await client.query(`
            INSERT INTO savings_history (user_id, name, detail, amount, date, type, icon)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
          `, [userId, ...sv]);
        }

        // 6. Populate Investment Asset Stocks (Depot)
        const initialFunds = [
          ['UniGlobal net', 'DE0008491051', 12.500, 21480.00, 5.82, '🌍', 'Sparplan 100 €/Monat'],
          ['UniEuropa net', 'DE0008491069', 8.750, 9187.50, 3.20, '🇪🇺', 'Sparplan 50 €/Monat'],
          ['UniRak Nachhaltig A', 'DE0008491028', 5.200, 5460.00, -0.80, '⚖️', null],
          ['UniOptima', 'DE0008491077', 2.315, 2285.25, 1.44, '🏦', null]
        ];

        for (const fund of initialFunds) {
          await client.query(`
            INSERT INTO depot_positions (user_id, name, isin, shares, value, performance, icon, sparplan_info)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
          `, [userId, ...fund]);
        }

        // 7. Initialize Security Profile Switches Toggle Registry
        await client.query(`
          INSERT INTO security_profiles (
            user_id, contactless, online_payments, foreign_payments, secure_go, smart_tan, email_notifications, push_notifications
          ) VALUES ($1, true, true, true, true, true, true, true);
        `, [userId]);

        await client.query('COMMIT');
        console.log("🇩🇪 SPARDA CORE ENGINE // Core banking ledger seeded successfully.");
      } else {
        console.log("🇩🇪 SPARDA CORE ENGINE // User logs detected. Skipping seeding sequence.");
      }

      // Safe deployment release back to connection worker threads
      client.release();
      return;

    } catch (err) {
      if (client) {
        console.log("🇩🇪 SPARDA CORE ENGINE // System exception detected. Overriding transaction state via ROLLBACK...");
        try {
          await client.query('ROLLBACK');
        } catch (rollbackErr) {
          console.error("Database connection dropped during rollback:", rollbackErr.message);
        } finally {
          client.release();
        }
      }

      console.error(`❌ DATABASE CONNECTION REJECTED // Message: ${err.message}`);
      
      retries -= 1;
      if (!retries) {
        console.error("❌ CRITICAL ARCHITECTURAL SHUTDOWN // Supabase connection stream exhausted. Stopping node execution.");
        process.exit(1);
      }

      // Wait out delay timeframe before firing retry initialization loop
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

// Execute initial handshake routine asynchronously
initializeDatabaseEngine();

module.exports = pool;
