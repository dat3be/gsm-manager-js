const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('ussd_logs.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');

    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS ussd_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      port TEXT,
      ussd_command TEXT,
      response TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS phone_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      port TEXT,
      phone_number TEXT UNIQUE,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

module.exports = db;
