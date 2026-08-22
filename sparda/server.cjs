const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// =================================
// SECURITY & COMPLIANCE MIDDLEWARE
// =================================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Request Payload Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Request Logging Interceptor
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] //Incoming ${req.method} request to: ${req.url}`);
  next();
});

// ==================================
// ROUTE AGGREGATION & GATEWAY LAYER
// ==================================
const spardaRoutingGateway = require('./src/server/all_routes.cjs');
app.use('/api/v1', spardaRoutingGateway);

// ================
// API 404 FALLBACK
// ================
app.all('/api/{*splat}', (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `API endpoint ${req.method} ${req.url} nicht gefunden.`,
    error_code: 'API_ROUTE_NOT_FOUND'
  });
});

// ==========================================
// CENTRALIZED DYNAMIC ERROR-CATCHING ENGINE
// ==========================================
app.use((err, req, res, next) => {
  console.error("❌ CRITICAL SPARDA SERVICE EXCEPTION CAPTURED:");

  console.table({
    Timestamp: new Date().toISOString(),
    Endpoint: `${req.method} ${req.url}`,
    Message: err.message || 'Unknown internal service fault.',
    Code: err.code || 'N/A',
    Stack: err.stack ? err.stack.split('\n')[1]?.trim() : 'N/A'
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || 'Ein interner Serverfehler ist aufgetreten.',
    error_code: err.code || 'INTERNAL_SERVER_ERROR'
  });
});

module.exports = app;
