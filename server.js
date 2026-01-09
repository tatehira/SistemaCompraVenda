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

app.get('/login', (req, res) => {
    res.redirect('/');
});

// --- Auth Endpoints ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'Credenciais inválidas' });
        res.json({
            message: 'Login successful',
            user: { id: row.id, username: row.username, role: row.role }
        });
    });
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Preencha todos os campos' });

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(400).json({ error: 'Usuário já existe' });

        db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, password, 'admin'], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User created', id: this.lastID });
        });
    });
});

// --- Points (Branches) Endpoints ---
app.get('/api/points', (req, res) => {
    db.all("SELECT * FROM points", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/points', (req, res) => {
    const { name, address } = req.body;
    db.run("INSERT INTO points (name, address) VALUES (?, ?)", [name, address], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, address });
    });
});

// --- Couriers Endpoints ---
app.get('/api/couriers', (req, res) => {
    db.all("SELECT * FROM couriers", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/couriers', (req, res) => {
    const { name, phone, default_fee } = req.body;
    db.run("INSERT INTO couriers (name, phone, default_fee) VALUES (?, ?, ?)", [name, phone, default_fee], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, phone, default_fee });
    });
});

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
    const { weight_grams, price, date, gold_type_id, customer_name, point_id } = req.body;
    const receipt_path = req.file ? req.file.path : null;
    const final_customer = customer_name || 'Fornecedor';

    const sql = `INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = ['BUY', weight_grams, price, final_customer, receipt_path, date || new Date().toISOString(), gold_type_id, point_id || 1];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, message: 'Purchase registered successfully' });
    });
});

// Register Sale (Sell)
app.post('/api/sell', upload.single('receipt'), (req, res) => {
    const { weight_grams, price, customer_name, date, gold_type_id, delivery_courier, delivery_cost, delivery_time, point_id, courier_id } = req.body;
    const receipt_path = req.file ? req.file.path : null;

    const sql = `INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, delivery_courier, delivery_cost, delivery_time, point_id, courier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        'SELL',
        weight_grams,
        price,
        customer_name,
        receipt_path,
        date || new Date().toISOString(),
        gold_type_id,
        delivery_courier || null,
        delivery_cost || 0,
        delivery_time || null,
        point_id || 1,
        courier_id || null
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
    const { weight_grams, price, customer_name, delivery_courier, delivery_cost, delivery_time, gold_type_id, date, point_id } = req.body;

    const sql = `
        UPDATE transactions 
        SET weight_grams = ?, price = ?, customer_name = ?, delivery_courier = ?, delivery_cost = ?, delivery_time = ?, gold_type_id = ?, date = ?, point_id = ?
        WHERE id = ?
    `;

    const params = [
        weight_grams,
        price,
        customer_name,
        delivery_courier || null,
        delivery_cost || 0,
        delivery_time || null,
        gold_type_id,
        date,
        point_id,
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

// Stock Correction (Add/Remove Stock manually)
app.post('/api/stock-correction', (req, res) => {
    const { gold_type_id, weight_grams, reason } = req.body;
    // We can simulate this as a 'BUY' (add) or 'SELL' (remove) with special flag or just 0 price?
    // User wants "adjust". Let's create a transaction type 'ADJUST' or just use BUY/SELL with 0 price and note.
    // Better: type='ADJUST'.
    // NOTE: 'type' column check in previous code was just 'BUY'/'SELL' strings, so 'ADJUST' is fine if I didn't enforce CHECK constraint. Creating table query didn't force CHECK.

    const type = weight_grams >= 0 ? 'BUY' : 'SELL'; // Or 'ADJUST'? 
    // If I use 'ADJUST', I need to update Inventory logic.
    // Let's use 'BUY'/'SELL' but with 0 price and customer_name as "AJUSTE DE ESTOQUE".

    const finalWeight = Math.abs(weight_grams);
    const finalType = weight_grams >= 0 ? 'BUY' : 'SELL';

    const sql = `INSERT INTO transactions (type, weight_grams, price, customer_name, date, gold_type_id, point_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [finalType, finalWeight, 0, `AJUSTE: ${reason}`, new Date().toISOString(), gold_type_id, point_id || 1];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Stock adjusted' });
    });
});

// Detailed Stock View (New)
app.get('/api/stock-details', (req, res) => {
    // Get stock grouped by Point and Gold Type
    const sql = `
        SELECT p.name as point_name, gt.name as gold_type_name, t.type, SUM(t.weight_grams) as total_weight
        FROM transactions t
        LEFT JOIN points p ON t.point_id = p.id
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        GROUP BY t.point_id, t.gold_type_id, t.type
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Process data
        const stock = {};
        rows.forEach(r => {
            const p = r.point_name || 'Desconhecido';
            const g = r.gold_type_name || 'Geral';
            if (!stock[p]) stock[p] = {};
            if (!stock[p][g]) stock[p][g] = 0;

            if (r.type === 'BUY') stock[p][g] += r.total_weight;
            if (r.type === 'SELL') stock[p][g] -= r.total_weight;
        });

        res.json(stock);
    });
});

// Analytics Endpoint
app.get('/api/analytics', (req, res) => {
    // Group by Date (YYYY-MM-DD)
    const sql = `
        SELECT 
            date(date) as day, 
            type, 
            SUM(price) as total_price, 
            SUM(weight_grams) as total_weight 
        FROM transactions 
        GROUP BY day, type 
        ORDER BY day ASC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Process for Chart.js
        const labels = [...new Set(rows.map(r => r.day))];
        const boughtData = labels.map(day => {
            const row = rows.find(r => r.day === day && r.type === 'BUY');
            return row ? row.total_weight : 0;
        });
        const soldData = labels.map(day => {
            const row = rows.find(r => r.day === day && r.type === 'SELL');
            return row ? row.total_weight : 0;
        });

        res.json({ labels, boughtData, soldData });
    });
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
