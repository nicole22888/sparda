const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
//  SECURITY & COMPLIANCE MIDDLEWARE
// ==========================================
// Enable Cross-Origin Resource Sharing for your Vercel React frontend layout streams
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Request Payload Parsers (Must be mounted above route registrations)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Request Logging Interceptor for active debugging logs
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] SPARDA ENGINE // Incoming ${req.method} request to: ${req.url}`);
  next();
});

// ==========================================
// 🛣️ ROUTE AGGREGATION & GATEWAY LAYER
// ==========================================
// Mount the consolidated Sparda routing system gateway we created
const spardaRoutingGateway = require('./src/server/all_routes.cjs');
app.use('/api/v1', spardaRoutingGateway);

// Force a strict 404 JSON response for any unmatched /api/ routes 
// so they don't accidentally serve the React index.html
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `API endpoint ${req.method} ${req.url} nicht gefunden.`,
    error_code: 'API_ROUTE_NOT_FOUND'
  });
});

//  PLUG-AND-PLAY ZONE FOR FUTURE MODULE INTEGRATIONS
// To scale your architecture later without cluttering code, just attach new routes below:
// app.use('/api/v1/loans', loanRoutingGateway);
// app.use('/api/v1/crypto-bridge', web3RoutingGateway);

// ==========================================
//  STATIC FRONTEND DISTRIBUTION DELIVERY
// ==========================================
// Serves your built production React workspace files from the public build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback Wildcard Route Handler: Directs all unmatched browser page refreshes 
// back to index.html so React's internal frontend router handles pages smoothly
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// ==========================================
// CENTRALIZED DYNAMIC ERROR-CATCHING ENGINE
// ==========================================
// This terminal catch-block intercepts unhandled runtime exceptions thrown 
// by any downstream service or generator file dynamically, ensuring absolute uptime.
app.use((err, req, res, next) => {
  console.error("❌ CRITICAL SPARDA SERVICE EXCEPTION CAPTURED:");
  console.table({
    Timestamp: new Date().toISOString(),
    Endpoint: `${req.method} ${req.url}`,
    Message: err.message || 'Unknown internal service fault.',
    Code: err.code || 'N/A',
    Stack: err.stack ? err.stack.split('\n')[1].trim() : 'N/A'
  });

  // Guard against crashing the connection thread if headers were already sent to the browser
  if (res.headersSent) {
    return next(err);
  }

  // Handle specific database or file system boundary errors gracefully
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

// Graceful Shutdown Protocol: Safely cleans worker loops if Render restarts the container
process.on('SIGTERM', () => {
  console.log('SPARDA BACKEND CORE // SIGTERM signal received. Commencing graceful process shutdown...');
  serverInstance.close(() => {
    console.log('SPARDA BACKEND CORE // Network connections terminated. Worker process ended.');
    process.exit(0);
  });
});
