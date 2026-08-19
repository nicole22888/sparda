const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// SECURITY & COMPLIANCE MIDDLEWARE
// ==========================================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Request Payload Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Request Logging Interceptor
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] SPARDA ENGINE // Incoming ${req.method} request to: ${req.url}`);
  next();
});

// ==========================================
// ROUTE AGGREGATION & GATEWAY LAYER
// ==========================================
const spardaRoutingGateway = require('./src/server/all_routes.cjs');
app.use('/api/v1', spardaRoutingGateway);

// ==========================================
// API 404 FALLBACK
// ==========================================
// Express 5 requires named wildcards.
// This catches unmatched API routes without
// allowing them to fall through to React.
app.all('/api/{*splat}', (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `API endpoint ${req.method} ${req.url} nicht gefunden.`,
    error_code: 'API_ROUTE_NOT_FOUND'
  });
});

// ==========================================
// STATIC FRONTEND DISTRIBUTION DELIVERY
// ==========================================
app.use(express.static(path.join(__dirname, 'dist')));

// ==========================================
// REACT SPA FALLBACK
// ==========================================
// Express 5 requires a named wildcard.
// Directs unmatched browser routes to React.
app.get('{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// ==========================================
// CENTRALIZED DYNAMIC ERROR-CATCHING ENGINE
// ==========================================
// Terminal error middleware.
// Must use the 4-argument Express signature.
app.use((err, req, res, next) => {
  console.error("❌ CRITICAL SPARDA SERVICE EXCEPTION CAPTURED:");

  console.table({
    Timestamp: new Date().toISOString(),
    Endpoint: `${req.method} ${req.url}`,
    Message: err.message || 'Unknown internal service fault.',
    Code: err.code || 'N/A',
    Stack: err.stack
      ? err.stack.split('\n')[1]?.trim()
      : 'N/A'
  });

  // Guard against crashing the connection thread
  // if headers have already been sent.
  if (res.headersSent) {
    return next(err);
  }

  // Handle database/file-system/runtime errors gracefully.
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || 'Ein interner Serverfehler ist aufgetreten.',
    error_code: err.code || 'INTERNAL_SERVER_ERROR'
  });
});

// ==========================================
// BOOTSTRAP INITIALIZATION
// ==========================================
const serverInstance = app.listen(PORT, () => {
  console.log("==========================================================================");
  console.log(`🇩🇪 SPARDA BANK BACKEND CORE ENGINE // Authorized Initialization Active`);
  console.log(`🛰️  API Gateway Layer Operational on Network Socket Port: ${PORT}`);
  console.log(`🖥️  Static Production Assets Distribution Route Hooked Cleanly`);
  console.log("==========================================================================");
});

// Graceful Shutdown Protocol
process.on('SIGTERM', () => {
  console.log('SPARDA BACKEND CORE // SIGTERM signal received. Commencing graceful process shutdown...');

  serverInstance.close(() => {
    console.log('SPARDA BACKEND CORE // Network connections terminated. Worker process ended.');
    process.exit(0);
  });
});
