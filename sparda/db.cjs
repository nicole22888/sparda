
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ CRITICAL INITIALIZATION ERROR // Missing DATABASE_URL environment variable.");
  process.exit(1);
}

// Direct connection pool architecture configurations
const pool = new Pool({
  connectionString: connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false } 
});

/**
 * Robust database initialization engine.
 * Connects to Supabase and verifies schemas exist without forcing seed data.
 */
const initializeDatabaseEngine = async (retries = 5, delay = 3000) => {
  while (retries) {
    let client = null;
    try {
      console.log(`🇩🇪 SPARDA CORE ENGINE // Connecting to Supabase pool... (Attempts left: ${retries})`);
      client = await pool.connect();
      console.log("🇩🇪 SPARDA CORE ENGINE // Handshake verified. Cloud network socket active.");

      // Verify tables exist without overwriting Jareed Lacosta's live data
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          netkey VARCHAR(50) UNIQUE NOT NULL,
          pin_hash VARCHAR(255) NOT NULL,
          transaction_pin_hash VARCHAR(255),
          transfer_count INTEGER DEFAULT 0,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          geburtsdatum DATE,
          steuer_id VARCHAR(50),
          adresse TEXT,
          telefon VARCHAR(50),
          email VARCHAR(100),
          kundennummer VARCHAR(50),
          mitglied_seit INTEGER
        );

        CREATE TABLE IF NOT EXISTS balances (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          giro_balance DECIMAL(12,2),
          spar_balance DECIMAL(12,2),
          depot_value DECIMAL(12,2),
          depot_cost_basis DECIMAL(12,2),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          tracking_number VARCHAR(100),
          execution_date TIMESTAMPTZ,
          amount DECIMAL(12,2),
          type VARCHAR(50),
          recipient_name VARCHAR(255),
          purpose TEXT,
          category VARCHAR(100),
          icon VARCHAR(50),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      
      console.log("🇩🇪 SPARDA CORE ENGINE // Base schema architecture verified. Live data preserved.");
      client.release();
      return;

    } catch (err) {
      console.error(`❌ DATABASE CONNECTION REJECTED // Message: ${err.message}`);
      retries -= 1;
      if (!retries) {
        console.error("❌ CRITICAL ARCHITECTURAL SHUTDOWN // Supabase connection stream exhausted. Stopping node execution.");
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

initializeDatabaseEngine();

module.exports = pool;