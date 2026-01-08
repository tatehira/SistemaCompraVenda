const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'gold_system.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeSchema();
    }
});

function initializeSchema() {
    db.serialize(() => {
        // Gold Types Table
        db.run(`CREATE TABLE IF NOT EXISTS gold_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`);

        // Transactions Table (Create if not exists)
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL, 
            weight_grams REAL NOT NULL,
            price REAL NOT NULL,
            customer_name TEXT,
            receipt_path TEXT,
            date TEXT NOT NULL,
            gold_type_id INTEGER,
            delivery_courier TEXT,
            delivery_cost REAL,
            FOREIGN KEY(gold_type_id) REFERENCES gold_types(id)
        )`);

        // Add new columns if they don't exist (Migration for existing db)
        const columnsToAdd = [
            { name: 'gold_type_id', type: 'INTEGER' },
            { name: 'delivery_courier', type: 'TEXT' },
            { name: 'delivery_cost', type: 'REAL' }
        ];

        columnsToAdd.forEach(col => {
            db.run(`ALTER TABLE transactions ADD COLUMN ${col.name} ${col.type}`, (err) => {
                // Ignore error if column already exists
                if (err && !err.message.includes('duplicate column')) {
                    console.error(`Error adding column ${col.name}:`, err.message);
                }
            });
        });
    });
}

module.exports = db;
