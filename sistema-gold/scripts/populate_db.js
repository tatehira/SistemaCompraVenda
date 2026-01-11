const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'gold_system.db');
const db = new Database(dbPath, { verbose: console.log });
const USER_ID = 2; // User 'nick'

console.log(`Connecting to database at ${dbPath}`);
console.log(`Seeding data for User ID: ${USER_ID}`);

const runTransaction = db.transaction(() => {
    // 1. Insert Gold Types
    const goldTypes = [
        { name: 'Ouro 18k' },
        { name: 'Ouro 24k' },
        { name: 'Prata 925' }
    ];

    const insertedGoldTypes = [];
    const insertGoldType = db.prepare('INSERT INTO gold_types (name, user_id) VALUES (?, ?)');

    // Check existing to avoid duplicates if run multiple times (optional, but good practice)
    // For simplicity, we just insert. If you want idempotency, you'd check first.
    // Given the request "create several data", we will just insert.

    for (const gt of goldTypes) {
        const info = insertGoldType.run(gt.name, USER_ID);
        insertedGoldTypes.push({ id: info.lastInsertRowid, name: gt.name });
    }
    console.log(`Inserted ${insertedGoldTypes.length} Gold Types.`);

    // 2. Insert Points
    const points = [
        { name: 'Loja Centro', address: 'Rua Principal, 100' },
        { name: 'Shopping Sul', address: 'Av. do Estado, 500' },
        { name: 'Escritório Norte', address: 'Rua das Flores, 20' }
    ];

    const insertedPoints = [];
    const insertPoint = db.prepare('INSERT INTO points (name, address, user_id) VALUES (?, ?, ?)');
    for (const p of points) {
        const info = insertPoint.run(p.name, p.address, USER_ID);
        insertedPoints.push({ id: info.lastInsertRowid, name: p.name });
    }
    console.log(`Inserted ${insertedPoints.length} Points.`);

    // 3. Insert Couriers
    const couriers = [
        { name: 'Rapidinho Entregas', phone: '11999999999', fee: 15.0 },
        { name: 'Sedex', phone: '0800', fee: 25.0 }
    ];

    const insertedCouriers = [];
    const insertCourier = db.prepare('INSERT INTO couriers (name, phone, default_fee, user_id) VALUES (?, ?, ?, ?)');
    for (const c of couriers) {
        const info = insertCourier.run(c.name, c.phone, c.fee, USER_ID);
        insertedCouriers.push({ id: info.lastInsertRowid, name: c.name });
    }
    console.log(`Inserted ${insertedCouriers.length} Couriers.`);

    // 4. Generate Transactions
    const transactionCount = 50;
    const insertTransaction = db.prepare(`
        INSERT INTO transactions (
            type, weight_grams, price, customer_name, date, 
            gold_type_id, point_id, courier_id, 
            delivery_courier, delivery_cost, delivery_time, 
            user_id, unit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Helper to get random date within last N days
    function getRandomDate(daysBack) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    const transactionTypes = ['BUY', 'SELL'];
    const units = ['g'];

    // Names for fake customers (for buying from them) or null
    const customerNames = ['João Silva', 'Maria Oliveira', 'Carlos Souza', 'Ana Pereira', null];

    for (let i = 0; i < transactionCount; i++) {
        const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const goldType = insertedGoldTypes[Math.floor(Math.random() * insertedGoldTypes.length)];
        const point = insertedPoints[Math.floor(Math.random() * insertedPoints.length)];
        const courier = insertedCouriers[Math.floor(Math.random() * insertedCouriers.length)];

        const weight = parseFloat((Math.random() * 50 + 1).toFixed(2)); // 1g to 50g
        // Fake price calculation: based on type (Sell usually higher price per gram than Buy)
        const basePrice = goldType.name.includes('18k') ? 250 : (goldType.name.includes('24k') ? 350 : 5);
        const pricePerGram = type === 'SELL' ? basePrice * 1.1 : basePrice * 0.9;
        const totalPrice = parseFloat((weight * pricePerGram).toFixed(2));

        const date = getRandomDate(60); // Last 60 days
        const customer = customerNames[Math.floor(Math.random() * customerNames.length)];

        // Optional courier fields (only if it makes sense contextually, but schema allows nulls)
        // Let's say for SELL we might use courier for delivery? Or BUY? 
        // Just filling them randomly for robust data.
        const useCourier = Math.random() > 0.5;
        const courierId = useCourier ? courier.id : null;
        const deliveryCourierName = useCourier ? courier.name : null;
        const deliveryCost = useCourier ? courier.fee : null;
        const deliveryTime = useCourier ? '2 dias' : null;

        insertTransaction.run(
            type,
            weight,
            totalPrice,
            customer,
            date,
            goldType.id,
            point.id,
            courierId,
            deliveryCourierName,
            deliveryCost,
            deliveryTime,
            USER_ID,
            'g'
        );
    }
    console.log(`Inserted ${transactionCount} Transactions.`);
});

try {
    runTransaction();
    console.log('Database population completed successfully.');
} catch (err) {
    console.error('Error populating database:', err);
}
