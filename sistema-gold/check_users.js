const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'gold_system.db');
const db = new Database(dbPath, { readonly: true });
const users = db.prepare("SELECT * FROM users").all();
console.log(users);
