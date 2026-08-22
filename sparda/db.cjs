
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(" Missing DATABASE_URL environment variable.");
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

   const initializeDatabaseEngine = async (retries = 5, delay = 3000) => {
   while (retries) {
   let client = null;
   try {
   console.log(`🇩🇪 Connecting to Supabase pool... (Attempts left: ${retries})`);
   client = await pool.connect();
   console.log("🇩🇪 Handshake verified. network active.");

   await client.query(`
   CREATE TABLE IF NOT EXISTS users (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
   giro_balance DECIMAL(12,2),
   spar_balance DECIMAL(12,2),
   depot_value DECIMAL(12,2),
   depot_cost_basis DECIMAL(12,2),
   updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE TABLE IF NOT EXISTS transactions (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

   CREATE TABLE IF NOT EXISTS security_profiles (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
   contactless BOOLEAN DEFAULT true,
   online_payments BOOLEAN DEFAULT true,
   foreign_payments BOOLEAN DEFAULT true,
   secure_go BOOLEAN DEFAULT true,
   smart_tan BOOLEAN DEFAULT false,
   email_notifications BOOLEAN DEFAULT true,
   push_notifications BOOLEAN DEFAULT false,
   device_model VARCHAR(255) DEFAULT 'Apple iPhone 14 Pro',
   device_activation_date DATE DEFAULT CURRENT_DATE,
   updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   `);

   console.log("🇩🇪 Base schema architecture verified. Live data preserved.");
   client.release();
   return;

   } catch (err) {
   console.error(`❌ DATABASE CONNECTION REJECTED // Message: ${err.message}`);
   retries -= 1;

   if (!retries) {
   console.error("❌ Supabase connection stream exhausted. Stopping node execution.");
   process.exit(1);
   }

   await new Promise(res => setTimeout(res, delay));
   }
   }
   };

initializeDatabaseEngine();

module.exports = pool;