const Database = require('better-sqlite3');
const path = require('path');

// Adjust path as needed, assuming running from project root
const dbPath = path.resolve(process.cwd(), 'gold_system.db');
console.log('Opening DB at:', dbPath);

try {
    const db = new Database(dbPath, { readonly: true });
    const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

    tables.forEach(table => {
        console.log('--- ' + table.name + ' ---');
        console.log(table.sql);
        console.log('\n');
    });
} catch (error) {
    console.error('Error opening DB:', error);
}
