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

        // Users Table (Auth)
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'admin'
        )`);

        // Points Table (Branches/Locations)
        db.run(`CREATE TABLE IF NOT EXISTS points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT
        )`);

        // Couriers Table (Motoboys)
        db.run(`CREATE TABLE IF NOT EXISTS couriers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            default_fee REAL
        )`);

        // Transactions Table (Updated)
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL, 
            weight_grams REAL NOT NULL,
            price REAL NOT NULL,
            customer_name TEXT,
            receipt_path TEXT,
            date TEXT NOT NULL,
            gold_type_id INTEGER,
            point_id INTEGER,
            courier_id INTEGER,
            delivery_courier TEXT,
            delivery_cost REAL,
            delivery_time TEXT,
            FOREIGN KEY(gold_type_id) REFERENCES gold_types(id),
            FOREIGN KEY(point_id) REFERENCES points(id),
            FOREIGN KEY(courier_id) REFERENCES couriers(id)
        )`);

        // Add new columns if they don't exist (Migration)
        const columnsToAdd = [
            { name: 'gold_type_id', type: 'INTEGER' },
            { name: 'point_id', type: 'INTEGER' },
            { name: 'courier_id', type: 'INTEGER' },
            { name: 'delivery_courier', type: 'TEXT' },
            { name: 'delivery_cost', type: 'REAL' },
            { name: 'delivery_time', type: 'TEXT' }
        ];

        columnsToAdd.forEach(col => {
            db.run(`ALTER TABLE transactions ADD COLUMN ${col.name} ${col.type}`, (err) => {
                if (err && !err.message.includes('duplicate column')) {
                    // console.error(`Error adding column ${col.name}:`, err.message);
                }
            });
        });

        // Seed default user if not exists
        db.get("SELECT count(*) as count FROM users", (err, row) => {
            if (!err && row.count === 0) {
                // Default: admin / admin123 (In production use bcrypt!)
                db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
            }
        });

        // Seed default point if not exists
        db.get("SELECT count(*) as count FROM points", (err, row) => {
            if (!err && row.count === 0) {
                db.run("INSERT INTO points (name, address) VALUES ('Loja Principal', 'Centro')");
            }
        });
    });
}

module.exports = db;
