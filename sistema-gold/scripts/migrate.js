const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'gold_system.db');
console.log('Migrating database at:', dbPath);

const db = new Database(dbPath);

const schema = `
    -- Users Table (Auth)
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        preferred_unit TEXT DEFAULT 'g'
    );

    -- Gold Types Table
    CREATE TABLE IF NOT EXISTS gold_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    -- Points Table (Branches)
    CREATE TABLE IF NOT EXISTS points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    -- Couriers Table
    CREATE TABLE IF NOT EXISTS couriers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        default_fee REAL,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    -- Measure Units Table
    CREATE TABLE IF NOT EXISTS measure_units (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        symbol TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    -- Transactions Table
    CREATE TABLE IF NOT EXISTS transactions (
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
    );
`;

try {
    db.exec(schema);
    console.log('Schema migration completed successfully.');

    // Seed default user if not exists
    const userCount = db.prepare('SELECT count(*) as count FROM users').get();
    if (userCount.count === 0) {
        db.prepare("INSERT INTO users (username, password) VALUES ('admin', 'admin123')").run();
        console.log('Seeded default admin user.');
    }

} catch (error) {
    console.error('Migration failed:', error);
}
