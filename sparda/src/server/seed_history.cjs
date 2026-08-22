const pool = require('../../db.cjs'); // Adjust path to your db.cjs if needed

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('⏳ Initiating Master Enterprise Financial Seed Protocol (Maritime Edition - All Users)...');
    await client.query('BEGIN');

    // 1. Fetch ALL users instead of just LIMIT 1
    const userResult = await client.query('SELECT id, first_name, last_name FROM users');
    if (userResult.rows.length === 0) throw new Error('No users found to seed.');
    
    console.log(`👥 Found ${userResult.rows.length} user(s). Applying seed to all accounts...`);

    // Loop through every user to ensure whoever is logged in gets the data
    for (const user of userResult.rows) {
      const userId = user.id;
      console.log(`🔄 Processing seed for user: ${user.first_name} ${user.last_name} (${userId})...`);

      // 2. Wipe ONLY volatile financial data for THIS user
      await client.query('DELETE FROM transactions WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM messages WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM depot_positions WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM standing_orders WHERE user_id = $1', [userId]);

      // 3. Define Timelines & Generators
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      
      // --- TRANSACTION GENERATORS ---
      const smallCompanies = [
        'REWE Supermarkt', 'ALDI Süd', 'Deutsche Bahn ICE', 'Netflix AB', 
        'Don Quijote (Japan)', '7-Eleven Singapore', 'Spotify GmbH', 
        'Edeka', 'UNIQLO Europe', 'Aral Tankstelle', 'Cathay Pacific Airways'
      ];

      const smallPurposes = [
        'Kartenzahlung POS', 'Monatliches Abonnement', 'Fahrkartenbuchung', 
        'Lebensmitteleinkauf', 'Tankrechnung', 'Reiseverpflegung', 
        'Flugbuchung Business', 'Hotelübernachtung'
      ];

      const corporatePartners = [
        'A.P. Møller - Mærsk A/S',    
        'COSCO SHIPPING Lines',       
        'Damen Shipyards Group',      
        'Hyundai Heavy Industries',   
        'CMA CGM S.A.',               
        'Seatrium Limited',           
        'Wärtsilä Corporation'        
      ];

      const corporatePurposesIncome = [
        'Maritime Logistics Contract Settlement',
        'Naval Architecture Consulting Fees',
        'Offshore Engineering Project Delivery',
        'Shipyard Subcontracting Payout Q3',
        'B2B Freight Forwarding Settlement'
      ];

      const corporatePurposesExpense = [
        'Marine Engine Parts Procurement',
        'Port Authority Fees & Customs Clearance',
        'Offshore Drilling Equipment Leasing',
        'Supply Chain Fleet Maintenance',
        'Shipyard Drydocking & Inspection Fees'
      ];

      let totalTransactionDelta = 0; // Reset math per user!

      // 4. Generate 11 Months of Small Personal Transactions
      for (let i = 0; i < 80; i++) {
        const date = randomDate(oneYearAgo, oneMonthAgo);
        const isIncome = Math.random() > 0.8; 
        const amount = (Math.random() * 480 + 10).toFixed(2) * (isIncome ? 1 : -1);
        const company = smallCompanies[Math.floor(Math.random() * smallCompanies.length)];
        const purpose = isIncome ? 'Rückerstattung / Gutschrift' : smallPurposes[Math.floor(Math.random() * smallPurposes.length)];
        
        totalTransactionDelta += parseFloat(amount);

        await client.query(`
          INSERT INTO transactions (user_id, recipient_name, purpose, amount, category, type, execution_date, tracking_code)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          userId, company, `${purpose} - ${date.toISOString().split('T')[0]}`, amount, 
          'Lebenshaltung', isIncome ? 'Gutschrift' : 'Lastschrift', 
          date.toISOString(), `SP-TX-${Math.floor(100000 + Math.random() * 900000)}-DE`
        ]);
      }

      // 5. Generate Last 30 Days of Massive Corporate Maritime Transactions
      for (let i = 0; i < 15; i++) {
        const date = randomDate(oneMonthAgo, now);
        const isIncome = Math.random() > 0.5;
        const amount = (Math.floor(Math.random() * 850000) + 120000).toFixed(2) * (isIncome ? 1 : -1); 
        const partner = corporatePartners[Math.floor(Math.random() * corporatePartners.length)];
        
        const purposeBase = isIncome 
          ? corporatePurposesIncome[Math.floor(Math.random() * corporatePurposesIncome.length)]
          : corporatePurposesExpense[Math.floor(Math.random() * corporatePurposesExpense.length)];
        
        const invoiceRef = `INV-${Math.floor(10000 + Math.random() * 90000)}-${date.getFullYear()}`;

        totalTransactionDelta += parseFloat(amount);

        await client.query(`
          INSERT INTO transactions (user_id, recipient_name, purpose, amount, category, type, execution_date, tracking_code)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          userId, partner, `${purposeBase} (Ref: ${invoiceRef})`, amount, 
          'Geschäftsausgaben', 'SEPA-Überweisung', 
          date.toISOString(), `SP-TX-${Math.floor(100000 + Math.random() * 900000)}-DE`
        ]);
      }

      // 6. Seed Depot Positions (€4.2M Portfolio with Maritime/Tech Mix)
      const depotStocks = [
        { name: 'A.P. Møller - Mærsk A/S', isin: 'DK0010244508', shares: 2500, value: 850000.00, performance: 12.4, icon: '🚢' },
        { name: 'COSCO SHIPPING Hldgs', isin: 'CNE1000002J7', shares: 150000, value: 420000.00, performance: -4.1, icon: '⛴️' },
        { name: 'Siemens AG (Marine Tech)', isin: 'DE0007236101', shares: 3500, value: 525000.00, performance: 8.4, icon: '⚙️' },
        { name: 'iShares Core MSCI World', isin: 'IE00B4L5Y983', shares: 16500, value: 1452000.00, performance: 22.5, icon: '🌍' },
        { name: 'Hyundai Heavy Industries', isin: 'KR7329180006', shares: 12000, value: 953000.00, performance: 18.2, icon: '🏗️' }
      ];

      for (const stock of depotStocks) {
        await client.query(`
          INSERT INTO depot_positions (user_id, name, isin, shares, value, performance, icon)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [userId, stock.name, stock.isin, stock.shares, stock.value, stock.performance, stock.icon]);
      }

      // 7. Seed Standing Orders (Daueraufträge)
      const standingOrders = [
        { recipient: 'Port of Rotterdam Authority', purpose: 'Quartalsmiete Liegeplatz & Lager', amount: 45000.00, day: 1 },
        { recipient: 'Lloyd’s Register', purpose: 'Maritime Certification & Inspections', amount: 8450.00, day: 15 },
        { recipient: 'Finanzamt Hamburg', purpose: 'Vorauszahlung Körperschaftsteuer', amount: 65000.00, day: 10 }
      ];

      for (const order of standingOrders) {
        await client.query(`
          INSERT INTO standing_orders (user_id, recipient_name, purpose, amount, execution_day)
          VALUES ($1, $2, $3, $4, $5)
        `, [userId, order.recipient, order.purpose, order.amount, order.day]);
      }

      // 8. Seed Realistic Bank Messages
      await client.query(`
        INSERT INTO messages (user_id, subject, preview, body, is_unread, date, created_at)
        VALUES 
        ($1, 'Q3 Customs & Freight Tax Docs', 'Your maritime logistics tax routing documents...', 'Your maritime logistics tax routing and customs documents for Q3 have been generated and are ready for download in your secure vault.', true, $2, $3),
        ($1, 'International Trade Limit Increased', 'Per your request, your daily outgoing...', 'Per your request, your daily outgoing SWIFT/SEPA transfer limit for international maritime settlements has been permanently increased to €5,000,000.', false, $4, $5)
      `, [
        userId, 
        now.toISOString().split('T')[0], now.toISOString(), 
        oneMonthAgo.toISOString().split('T')[0], oneMonthAgo.toISOString()
      ]);

      // 9. Calibrate Final Balances Mathematically
      const baseHistoricalBalance = 8500000.00; // Scaled up to €8.5M base for a shipping entity
      const finalGiroBalance = baseHistoricalBalance + totalTransactionDelta;

      await client.query(`
        UPDATE balances 
        SET giro_balance = $1, spar_balance = $2, depot_value = $3 
        WHERE user_id = $4
      `, [finalGiroBalance.toFixed(2), 3250000.00, 4200000.00, userId]);
      
      console.log(`✅ Calibrated balance for ${user.first_name}: €${finalGiroBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`);
    }

    await client.query('COMMIT');
    console.log(`\n🚀 Master Enterprise Financial Seed Complete for ALL accounts! Refresh your frontend.`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding Failed:', error);
  } finally {
    client.release();
  }
};

seedDatabase();
