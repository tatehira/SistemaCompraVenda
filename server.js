const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// API Endpoints

// Get Gold Types
app.get('/api/gold-types', (req, res) => {
    db.all(`SELECT * FROM gold_types`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add Gold Type
app.post('/api/gold-types', (req, res) => {
    const { name } = req.body;
    db.run(`INSERT INTO gold_types (name) VALUES (?)`, [name], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name });
    });
});

// Get Inventory Status (Grouped by Gold Type)
app.get('/api/inventory', (req, res) => {
    // We want stock per gold type.
    const sql = `
        SELECT 
            t.gold_type_id, 
            gt.name as input_gold_name, 
            t.type, 
            SUM(t.weight_grams) as total_weight 
        FROM transactions t
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        GROUP BY t.gold_type_id, t.type
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Organize data: { "Gold 18k": { bought: 100, sold: 50, stock: 50 }, ... }
        const report = {};

        rows.forEach(row => {
            const typeName = row.input_gold_name || 'Sem Tipo'; // Default if null
            if (!report[typeName]) {
                report[typeName] = { bought: 0, sold: 0, stock: 0 };
            }
            if (row.type === 'BUY') report[typeName].bought = row.total_weight;
            if (row.type === 'SELL') report[typeName].sold = row.total_weight;
        });

        // Calculate stock
        Object.keys(report).forEach(key => {
            report[key].stock = report[key].bought - report[key].sold;
        });

        res.json(report);
    });
});

// Get All Transactions
app.get('/api/transactions', (req, res) => {
    const sql = `
        SELECT t.*, gt.name as gold_type_name 
        FROM transactions t 
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id 
        ORDER BY date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Register Purchase (Buy Gold)
app.post('/api/buy', upload.single('receipt'), (req, res) => {
    const { weight_grams, price, date, gold_type_id, customer_name } = req.body;
    const receipt_path = req.file ? req.file.path : null;
    const final_customer = customer_name || 'Fornecedor';

    const sql = `INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = ['BUY', weight_grams, price, final_customer, receipt_path, date || new Date().toISOString(), gold_type_id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, message: 'Purchase registered successfully' });
    });
});

// Register Sale (Sell Gold)
app.post('/api/sell', upload.single('receipt'), (req, res) => {
    const { weight_grams, price, customer_name, date, gold_type_id, delivery_courier, delivery_cost } = req.body;
    const receipt_path = req.file ? req.file.path : null;

    // Simple stock check logic could be here, but sticking to "allow negative" for MVP or check logic
    // For now, allow insert.

    const sql = `INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, delivery_courier, delivery_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        'SELL',
        weight_grams,
        price,
        customer_name,
        receipt_path,
        date || new Date().toISOString(),
        gold_type_id,
        delivery_courier || null,
        delivery_cost || 0
    ];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, message: 'Sale registered successfully' });
    });
});

// Update Transaction (Edit)
app.put('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { weight_grams, price, customer_name, delivery_courier, delivery_cost, gold_type_id, date } = req.body;

    // We only update fields that are provided. using COALESCE or dynamic query is better, 
    // but for simplicity we will assume full payload or build query dynamically.
    // Let's assume full payload for simplicity from frontend Modal.

    const sql = `
        UPDATE transactions 
        SET weight_grams = ?, price = ?, customer_name = ?, delivery_courier = ?, delivery_cost = ?, gold_type_id = ?, date = ?
        WHERE id = ?
    `;

    const params = [
        weight_grams,
        price,
        customer_name,
        delivery_courier || null,
        delivery_cost || 0,
        gold_type_id,
        date,
        id
    ];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Transaction updated', changes: this.changes });
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
