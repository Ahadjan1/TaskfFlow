const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function initDB() {
  console.log('⏳ Connecting to Aiven Cloud Database...');
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split queries by semicolon (simple split, ignoring comments and whitespace)
    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--') && !q.startsWith('CREATE DATABASE') && !q.startsWith('USE'));

    console.log(`📝 Found ${queries.length} tables/commands to run.`);

    for (let query of queries) {
      console.log(`🚀 Executing: ${query.substring(0, 50)}...`);
      await db.query(query);
    }

    console.log('✅ Database initialized successfully on Aiven Cloud!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    process.exit(1);
  }
}

initDB();
