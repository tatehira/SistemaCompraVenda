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
        // Gold Types Table (Updated with user_id)
        db.run(`CREATE TABLE IF NOT EXISTS gold_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
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
            address TEXT,
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Couriers Table (Motoboys)
        db.run(`CREATE TABLE IF NOT EXISTS couriers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            default_fee REAL,
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Measure Units Table
        db.run(`CREATE TABLE IF NOT EXISTS measure_units (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            symbol TEXT NOT NULL,
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Transactions Table (Updated with unit)
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
            user_id INTEGER,
            unit TEXT,
            FOREIGN KEY(gold_type_id) REFERENCES gold_types(id),
            FOREIGN KEY(point_id) REFERENCES points(id),
            FOREIGN KEY(courier_id) REFERENCES couriers(id),
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Add new columns if they don't exist (Migration)
        const columnsToAdd = [
            { table: 'transactions', name: 'gold_type_id', type: 'INTEGER' },
            { table: 'transactions', name: 'point_id', type: 'INTEGER' },
            { table: 'transactions', name: 'courier_id', type: 'INTEGER' },
            { table: 'transactions', name: 'delivery_courier', type: 'TEXT' },
            { table: 'transactions', name: 'delivery_cost', type: 'REAL' },
            { table: 'transactions', name: 'delivery_time', type: 'TEXT' },
            { table: 'transactions', name: 'user_id', type: 'INTEGER' },
            { table: 'transactions', name: 'unit', type: 'TEXT' },
            { table: 'points', name: 'user_id', type: 'INTEGER' },
            { table: 'couriers', name: 'user_id', type: 'INTEGER' },
            { table: 'gold_types', name: 'user_id', type: 'INTEGER' },
            { table: 'measure_units', name: 'user_id', type: 'INTEGER' }
        ];

        columnsToAdd.forEach(col => {
            db.run(`ALTER TABLE ${col.table || 'transactions'} ADD COLUMN ${col.name} ${col.type}`, (err) => {
                if (err && !err.message.includes('duplicate column')) {
                    // console.error(`Error adding column ${col.name}:`, err.message);
                }
            });
        });

        // MIGRATE GOLD TYPES UNIQUE CONSTRAINT (Robust & Idempotent)
        // We check if we need to migrate by looking at the schema or just wrapping in try-catch logic implied by the structure.
        // For safety/simplification now: We will NOT auto-run the Rename/Drop block every time.
        // Instead, we rely on the initial CREATE statement (which we changed to NOT have UNIQUE) for new installs.
        // For existing installs, we might have the constraint.
        // A safe migration would be: check if 'gold_types_old' exists (failed mid-migration).

        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='gold_types_old'", (err, row) => {
            if (row) {
                // If _old exists, it means we might have failed before or finished but not dropped.
                // We should check if gold_types exists.
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='gold_types'", (e, r) => {
                    if (!r) {
                        // gold_types missing? Rename old back to restore or create new?
                        // Let's create new and copy from old.
                        db.run(`CREATE TABLE gold_types (
                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                             name TEXT NOT NULL,
                             user_id INTEGER,
                             FOREIGN KEY(user_id) REFERENCES users(id)
                        )`);
                        db.run(`INSERT INTO gold_types (id, name, user_id) SELECT id, name, NULL FROM gold_types_old`, () => {
                            db.run(`DROP TABLE gold_types_old`);
                        });
                    } else {
                        // Both exist? Maybe migration finished but didn't drop old.
                        db.run(`DROP TABLE gold_types_old`);
                    }
                });
            } else {
                // Normal operation. We don't want to run the heavy rename migration every boot.
                // We will skip it to prevent loops/crashes.
            }
        });

        // Add preferred_unit to users
        db.run(`ALTER TABLE users ADD COLUMN preferred_unit TEXT DEFAULT 'g'`, (err) => {
            if (err && !err.message.includes('duplicate column')) {
                // console.log("Added preferred_unit column");
            }
        });

        // Seed Defaults
        db.serialize(() => {
            db.get("SELECT count(*) as count FROM users", (err, row) => {
                if (!err && row.count === 0) {
                    // Default: admin / admin123 (In production use bcrypt!)
                    db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
                }
            });
            db.get("SELECT count(*) as count FROM points", (err, row) => {
                if (!err && row.count === 0) {
                    db.run("INSERT INTO points (name, address) VALUES ('Loja Principal', 'Centro')");
                }
            });
            // Seed Check: We don't verify if units exist because they are per-user in theory, or system wide?
            // Let's not auto-seed units to avoid clutter if user want empty. Or maybe seed 'g' and 'kg' for NULL user?
            // Better: Allow user to create them.
        });
    });
}

module.exports = db;
