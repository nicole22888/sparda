const express = require('express');
const router = express.Router();
const { generateOfficialKontoauszugStream } = require('./kontoauszug.generator');

// ================
// IN-MEMORY CENTRAL DATABASE SYSTEM TRUTH 
// ================
// This data array isolates your states. When Supabase is ready, these local 
// variables will simply be swapped for SQL pooling queries.
let userSession = null;

let virtualBalances = {
  giro: 2847.93,
  spar: 15240.00,
  depotValue: 38412.75,
  depotCostBasis: 36600.00
};

let cardSecuritySettings = {
  contactless: true,
  onlinePayments: true,
  foreignPayments: true
};

let userProfileSettings = {
  secureGo: true,
  smartTan: true,
  emailNotifications: true,
  pushNotifications: true
};

// Global in-memory list tracking live transaction rows
let transactionLedger = [
  {
    id: "SP-TX-INIT-01",
    date: "2026-03-07T07:42:00Z",
    amount: 3200.00,
    type: "income",
    recipient_name: "Gehaltseingang Siemens AG",
    purpose: "Gehalt März 2026 · SEPA-Überweisung",
    category: "Einnahmen",
    icon: "💰"
  },
  {
    id: "SP-TX-INIT-02",
    date: "2026-03-06T12:30:00Z",
    amount: -94.38,
    type: "expense",
    recipient_name: "REWE Kaufpark München",
    purpose: "Kartenzahlung · Girocard · Terminal 4812",
    category: "Ausgaben",
    icon: "🛒"
  },
  {
    id: "SP-TX-INIT-03",
    date: "2026-03-05T15:10:00Z",
    amount: -7.90,
    type: "expense",
    recipient_name: "Starbucks Coffee München Hbf",
    purpose: "Kartenzahlung · Girocard",
    category: "Ausgaben",
    icon: "☕"
  },
  {
    id: "SP-TX-INIT-04",
    date: "2026-03-01T00:01:00Z",
    amount: -950.00,
    type: "expense",
    recipient_name: "Hausverwaltung GmbH · Miete",
    purpose: "Dauerauftrag · IBAN: DE12 7009 0500 9988...",
    category: "Daueraufträge",
    icon: "🏠"
  },
  {
    id: "SP-TX-INIT-05",
    date: "2026-03-01T00:05:00Z",
    amount: -500.00,
    type: "transfer",
    recipient_name: "Eigene Umbuchung · SpardaSpar",
    purpose: "Sparkonto Aufstockung",
    category: "Daueraufträge",
    icon: "🔁"
  }
];

let savingsLedger = [
  { name: "Zinsgutschrift", detail: "2,5 % p.a. · Feb 2026", amount: 31.75, date: "2026-02-28", type: "income", icon: "💸" },
  { name: "Zinsgutschrift", detail: "2,5 % p.a. · Jan 2026", amount: 29.88, date: "2026-01-31", type: "income", icon: "💸" },
  { name: "Einzahlung vom Girokonto", detail: "Sparrate März", amount: 500.00, date: "2026-03-01", type: "transfer", icon: "🔁" }
];

let depotPositions = [
  { name: "UniGlobal net", isin: "DE0008491051", shares: 12.500, value: 21480.00, performance: 5.82, icon: "🌍", sparplanInfo: "Sparplan 100 €/Monat" },
  { name: "UniEuropa net", isin: "DE0008491069", shares: 8.750, value: 9187.50, performance: 3.20, icon: "🇪🇺", sparplanInfo: "Sparplan 50 €/Monat" },
  { name: "UniRak Nachhaltig A", isin: "DE0008491028", shares: 5.200, value: 5460.00, performance: -0.80, icon: "⚖️", sparplanInfo: null },
  { name: "UniOptima", isin: "DE0008491077", shares: 2.315, value: 2285.25, performance: 1.44, icon: "🏦", sparplanInfo: null }
];

// =========================================================================
// 🔑 1. AUTHENTICATION SERVICE PATH (Called by Login.jsx)
// =========================================================================
router.post('/auth/login', (req, res) => {
  const { netKey, pin } = req.body;

  if (netKey === 'Sparda1234512.05.85' && pin === '123456') {
    userSession = { name: "Thomas Müller", accountType: "SpardaGiro Klassik", kundennummer: "123456" };
    return res.status(200).json({ success: true, message: "Erfolgreich angemeldet.", user: userSession });
  }
  return res.status(401).json({ success: false, message: "Anmeldedaten sind ungültig (Falscher NetKey oder PIN)." });
});

// =========================================================================
// 🔔 2. SYSTEM NOTIFICATION LAYER COUNTER (Called by Header.jsx)
// =========================================================================
router.get('/user/notifications/summary', (req, res) => {
  // Counts current transactions acting as unread ePostfach mail events dynamically
  const dynamicUnreadCount = transactionLedger.length > 5 ? 4 : 3;
  return res.status(200).json({ success: true, unreadMails: dynamicUnreadCount });
});

// =========================================================================
// 💸 3. TRANSACTION DISPATCH AND LEDGER BALANCER (Called by Ueberweisung.jsx)
// =========================================================================
router.post('/transfers', (express.json()), (req, res) => {
  const { trackingNumber, recipientName, recipientIban, recipientBic, amount, purpose, executionDate } = req.body;

  if (!recipientName || !recipientIban || !amount) {
    return res.status(400).json({ success: false, message: "Missing required transactional fields." });
  }

  // Double-Entry Balance Arithmetic Execution
  virtualBalances.giro = parseFloat((virtualBalances.giro - amount).toFixed(2));

  // If user transfers money internally to their own savings account, increase savings balance too
  if (String(recipientName).toLowerCase().includes('spardaspar') || String(purpose).toLowerCase().includes('spardaspar')) {
    virtualBalances.spar = parseFloat((virtualBalances.spar + amount).toFixed(2));
    savingsLedger.unshift({
      name: "Einzahlung vom Girokonto",
      detail: purpose || "Umbuchung",
      amount: amount,
      date: executionDate || new Date().toISOString().split('T')[0],
      type: "transfer",
      icon: "🔁"
    });
  }

  // Log the new dynamic row record directly to the master ledger array
  transactionLedger.unshift({
    id: trackingNumber || 'SP-TX-' + Date.now(),
    date: executionDate ? new Date(executionDate).toISOString() : new Date().toISOString(),
    amount: -Math.abs(amount),
    type: "expense",
    recipient_name: recipientName,
    purpose: purpose || "Überweisung",
    category: "Ausgaben",
    icon: "🛒"
  });

  return res.status(201).json({ success: true, message: "Überweisung erfolgreich gebucht." });
});

// =========================================================================
// 📊 4. GIRO LEDGER RECONCILIATION LISTS (Called by Umsaetze.jsx)
// =========================================================================
router.get('/transfers', (req, res) => {
  return res.status(200).json({ success: true, transactions: transactionLedger });
});

// =========================================================================
// 📈 5. SAVINGS LEDGER STATUS STACK (Called by Sparkonto.jsx)
// =========================================================================
router.get('/sparkonto', (req, res) => {
  return res.status(200).json({ success: true, balance: virtualBalances.spar, history: savingsLedger });
});

// =========================================================================
// 🔒 6. INTERACTIVE CARD TOGGLE ENGINE (Called by Karten.jsx)
// =========================================================================
router.get('/cards/settings', (req, res) => {
  return res.status(200).json({ success: true, settings: cardSecuritySettings });
});

router.post('/cards/settings', (req, res) => {
  const { field, value } = req.body;
  if (cardSecuritySettings.hasOwnProperty(field)) {
    cardSecuritySettings[field] = Boolean(value);
    return res.status(200).json({ success: true, message: "Einstellung gespeichert." });
  }
  return res.status(400).json({ success: false, message: "Invalid setting target column field." });
});

// =========================================================================
// 📈 7. INVESTMENT PORTFOLIO EVALUATOR (Called by Depot.jsx)
// =========================================================================
router.get('/depot', (req, res) => {
  return res.status(200).json({
    success: true,
    depotValue: virtualBalances.depotValue,
    costBasis: virtualBalances.depotCostBasis,
    positions: depotPositions
  });
});

// =========================================================================
// 🛂 8. USER PROFILE PREFERENCE PROFILE CONTROLLER (Called by Profil.jsx)
// =========================================================================
router.post('/user/settings', (req, res) => {
  const { field, value } = req.body;
  if (userProfileSettings.hasOwnProperty(field)) {
    userProfileSettings[field] = Boolean(value);
    return res.status(200).json({ success: true, message: "Sicherheitsverfahren aktualisiert." });
  }
  return res.status(400).json({ success: false, message: "Invalid security layout variable." });
});

// =========================================================================
// 📄 9. OFFICIAL ELEKTRONISCHER KONTOAUSZUG STREAM (Called by Postfach.jsx)
// =========================================================================
router.get('/sparda/kontoauszug/:trackingNumber', generateOfficialKontoauszugStream);

module.exports = router;
