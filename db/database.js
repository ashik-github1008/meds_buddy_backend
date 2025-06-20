const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./medication.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    dosage TEXT,
    frequency TEXT,
    taken_dates TEXT, -- JSON string of dates
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
