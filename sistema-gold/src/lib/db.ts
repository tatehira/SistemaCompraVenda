import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'gold_system.db');

const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');

export default db;
