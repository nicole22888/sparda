const express = require('express');
const router = express.Router();
const { generateOfficialKontoauszugStream } = require('./kontoauszug.generator');

/**
 * 🇩🇪 SPARDA BANK COMPLIANCE API ROUTE MAP
 * Target Endpoint: GET /api/v1/sparda/kontoauszug/:trackingNumber
 * 
 * This route is called directly by the frontend React application's <iframe> src parameter.
 * It streams a live binary PDF buffer straight to the browser sandbox window context.
 */
router.get('/sparda/kontoauszug/:trackingNumber', generateOfficialKontoauszugStream);

module.exports = router;
