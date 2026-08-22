const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL environment variable.");
  process.exit(1);
}

// ==========================================
// SERVERLESS DATABASE POOL
// ==========================================
const pool = new Pool({
  connectionString: connectionString,
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false } 
});

pool.on('connect', () => {
  console.log("🇩🇪 Handshake with Supabase established.");
});

module.exports = pool;
