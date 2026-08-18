const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../../../../db'); // Connects directly to your root db.js script
const { generateOfficialKontoauszugStream } = require('./kontoauszug.generator');

// Temporary structural reference token matching your database seeding netkey configuration rule
const TARGET_USER_NETKEY = 'Sparda1234512.05.85';

/**
 * 🔑 Central Helper Utility
 * Extracts the user UUID hash safely from the array stream to feed down to other route pipelines.
 */
const getActiveUserId = async () => {
  const result = await pool.query('SELECT id FROM users WHERE netkey = $1 LIMIT 1', [TARGET_USER_NETKEY]);
  if (result.rows.length === 0) throw new Error('User registry entry missing inside database.');
  return result.rows[0].id; // ⚡ FIXED: Added [0] index to avoid reading properties of an undefined array stream
};

// =========================================================================
// 🔑 1. AUTHENTICATION CONTROLLER ENDPOINT (Called by Login.jsx)
// =========================================================================
router.post('/auth/login', async (req, res, next) => {
  try {
    const { netKey, pin } = req.body;

    if (!netKey || !pin) {
      return res.status(400).json({ success: false, message: 'NetKey und PIN sind erforderlich.' });
    }

    const result = await pool.query('SELECT id, pin_hash, first_name, last_name, kundennummer FROM users WHERE netkey = $1 LIMIT 1', [netKey.trim()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Anmeldedaten sind ungültig (Falscher NetKey oder PIN).' });
    }

    const userRow = result.rows[0]; // ⚡ FIXED: Extract the raw object layer from index 0

    // Cryptographic decryption check against the hashed database string parameters
    const match = await bcrypt.compare(pin, userRow.pin_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Anmeldedaten sind ungültig (Falscher NetKey oder PIN).' });
    }

    return res.status(200).json({
      success: true,
      message: 'Erfolgreich angemeldet.',
      user: {
        name: `${userRow.first_name} ${userRow.last_name}`,
        accountType: 'SpardaGiro Klassik',
        kundennummer: userRow.kundennummer
      }
    });
  } catch (err) {
    next(err); // Relays errors to the centralized dynamic catch-block in server.js
  }
});

// =========================================================================
// 🔔 2. LIVE SYSTEM MAIL BOX COUNT METRICS (Called by Header.jsx)
// =========================================================================
router.get('/user/notifications/summary', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    const txCountResult = await pool.query('SELECT COUNT(*) FROM transactions WHERE user_id = $1', [userId]);
    const totalTransactions = parseInt(txCountResult.rows[0].count, 10); // ⚡ FIXED: Access via rows[0]

    const dynamicUnreadMails = totalTransactions > 5 ? 4 : 3;

    return res.status(200).json({ success: true, unreadMails: dynamicUnreadMails });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 💸 3. SEPA BALANCING TRANSACTION AND DOUBLE-ENTRY REGISTRY (Called by Ueberweisung.jsx)
// =========================================================================
router.post('/transfers', async (req, res, next) => {
  let client;
  try {
    const { trackingNumber, recipientName, recipientIban, recipientBic, amount, purpose, executionDate } = req.body;

    if (!recipientName || !recipientIban || !amount) {
      return res.status(400).json({ success: false, message: 'Fehlende Pflichtfelder für die Überweisung.' });
    }

    const userId = await getActiveUserId();
    const parsedAmount = Math.abs(parseFloat(amount));

    // Acquire worker thread for database multi-query tracking safety
    client = await pool.connect();
    await client.query('BEGIN');

    // 1. Double-Entry Balancing Math: Deduct liquidity from the main Giro pool
    const updateGiroSql = `
      UPDATE balances 
      SET giro_balance = giro_balance - $1 
      WHERE user_id = $2;
    `;
    await client.query(updateGiroSql, [parsedAmount, userId]);

    // 2. Conditional Routing Hook: If transfer targets internal savings, sync balances dynamically
    const cleanRecipient = String(recipientName).toLowerCase();
    const cleanPurpose = String(purpose).toLowerCase();
    
    if (cleanRecipient.includes('spardaspar') || cleanPurpose.includes('spardaspar')) {
      const updateSparSql = 'UPDATE balances SET spar_balance = spar_balance + $1 WHERE user_id = $2';
      await client.query(updateSparSql, [parsedAmount, userId]);

      const insertSavingsSql = `
        INSERT INTO savings_history (user_id, name, detail, amount, date, type, icon)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;
      await client.query(insertSavingsSql, [
        userId, 
        'Einzahlung vom Girokonto', 
        purpose || 'Sparrate', 
        parsedAmount, 
        executionDate || new Date().toISOString().split('T')[0], 
        'transfer', 
        '🔁'
      ]);
    }

    // 3. Log the permanent tracking ledger row into the Umsaetze table
    const insertTxSql = `
      INSERT INTO transactions (user_id, tracking_number, execution_date, amount, type, recipient_name, purpose, category, icon)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;
    await client.query(insertTxSql, [
      userId,
      trackingNumber || `SP-TX-${Date.now()}-DE`,
      executionDate ? new Date(executionDate).toISOString() : new Date().toISOString(),
      -parsedAmount, // Force negative formatting logic on all debits
      'expense',
      recipientName,
      purpose || 'SEPA-Überweisung',
      cleanPurpose.includes('dauerauftrag') ? 'Daueraufträge' : 'Ausgaben',
      '🛒'
    ]);

    await client.query('COMMIT');
    client.release();

    return res.status(201).json({ success: true, message: 'Überweisung erfolgreich gebucht.' });

  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (rErr) {}
      client.release();
    }
    next(err);
  }
});

// =========================================================================
// 📊 4. CHRONOLOGICAL RECONCILIATION SELECTION (Called by Umsaetze.jsx)
// =========================================================================
router.get('/transfers', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    
    const result = await pool.query('SELECT tracking_number, execution_date, amount, type, recipient_name, purpose, category, icon FROM transactions WHERE user_id = $1 ORDER BY execution_date DESC', [userId]);
    
    return res.status(200).json({ success: true, transactions: result.rows });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 📈 5. SAVINGS INTEREST LEDGER HISTORY VIEW (Called by Sparkonto.jsx)
// =========================================================================
router.get('/sparkonto', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    const balanceResult = await pool.query('SELECT spar_balance FROM balances WHERE user_id = $1 LIMIT 1', [userId]);
    const historyResult = await pool.query('SELECT name, detail, amount, date, type, icon FROM savings_history WHERE user_id = $1 ORDER BY date DESC', [userId]);

    return res.status(200).json({
      success: true,
      balance: parseFloat(balanceResult.rows[0].spar_balance), // ⚡ FIXED: Added index indicator bracket [0]
      history: historyResult.rows
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 🔒 6. DYNAMIC CARDS TOGGLE PROCESSOR (Called by Karten.jsx)
// =========================================================================
router.get('/cards/settings', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    const result = await pool.query('SELECT contactless, online_payments, foreign_payments FROM security_profiles WHERE user_id = $1 LIMIT 1', [userId]);
    
    const settingsRow = result.rows[0]; // ⚡ FIXED: Added structural index mapping bracket [0]
    
    return res.status(200).json({
      success: true,
      settings: {
        contactless: settingsRow.contactless,
        onlinePayments: settingsRow.online_payments,
        foreignPayments: settingsRow.foreign_payments
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/cards/settings', async (req, res, next) => {
  try {
    const { field, value } = req.body;
    const userId = await getActiveUserId();

    const columnMapping = {
      contactless: 'contactless',
      onlinePayments: 'online_payments',
      foreignPayments: 'foreign_payments'
    };

    const targetColumn = columnMapping[field];
    if (!targetColumn) {
      return res.status(400).json({ success: false, message: 'Ungültiges Einstellungsfeld.' });
    }

    const sql = `UPDATE security_profiles SET ${targetColumn} = $1 WHERE user_id = $2`;
    await pool.query(sql, [Boolean(value), userId]);

    return res.status(200).json({ success: true, message: 'Einstellung erfolgreich gespeichert.' });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 📈 7. INVESTMENT PORTFOLIO EVALUATOR (Called by Depot.jsx)
// =========================================================================
router.get('/depot', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    const balanceResult = await pool.query('SELECT depot_value, depot_cost_basis FROM balances WHERE user_id = $1 LIMIT 1', [userId]);
    const positionsResult = await pool.query('SELECT name, isin, shares, value, performance, icon, sparplan_info AS "sparplanInfo" FROM depot_positions WHERE user_id = $1', [userId]);
    
    const balanceRow = balanceResult.rows[0]; // ⚡ FIXED: Added structural array extraction bracket [0]
    
    return res.status(200).json({
      success: true,
      depotValue: parseFloat(balanceRow.depot_value),
      costBasis: parseFloat(balanceRow.depot_cost_basis),
      positions: positionsResult.rows.map(row => ({
        ...row,
        shares: parseFloat(row.shares),
        value: parseFloat(row.value),
        performance: parseFloat(row.performance)
      }))
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 🛡️ 8. USER PROFILE CONFIGURATION OVERRIDES (Called by Profil.jsx)
// =========================================================================
router.post('/user/settings', async (req, res, next) => {
  try {
    const { field, value } = req.body;
    const userId = await getActiveUserId();
    
    const columnMapping = {
      secureGo: 'secure_go',
      smartTan: 'smart_tan',
      emailNotifications: 'email_notifications',
      pushNotifications: 'push_notifications'
    };
    
    const targetColumn = columnMapping[field];
    if (!targetColumn) {
      return res.status(400).json({ success: false, message: 'Ungültiges Sicherheitsfeld.' });
    }
    
    // Fixed missing template literal backticks
    const sql = `UPDATE security_profiles SET ${targetColumn} = $1 WHERE user_id = $2`;
    await pool.query(sql, [Boolean(value), userId]);
    
    return res.status(200).json({ success: true, message: 'Sicherheitsverfahren erfolgreich aktualisiert.' });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 🏠 10. STANDING ORDERS LEDGER CONTROLLER (Called by Dauerauftrag.jsx)
// =========================================================================
router.get('/dauerauftraege', async (req, res, next) => {
try {
const userId = await getActiveUserId();
const result = await pool.query(
'SELECT id, recipient_name, recipient_iban, amount, schedule_text, icon, bg_color FROM standing_orders WHERE user_id = $1 ORDER BY created_at DESC',
[userId]
);

// Fallback: If your database table row count is clean, send success with empty array so UI fallbacks trigger safely
return res.status(200).json({ success: true, orders: result.rows });
} catch (err) {
next(err);
}
});

// =========================================================================
// 📄 9. OFFICIAL ELEKTRONISCHER KONTOAUSZUG STREAM (Called by Postfach.jsx)
// =========================================================================
router.get('/sparda/kontoauszug/:trackingNumber', generateOfficialKontoauszugStream);

module.exports = router;
