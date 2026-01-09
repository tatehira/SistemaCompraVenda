// Main App Logic
const API_URL = 'http://localhost:3000/api';

// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// MAKE LOGOUT GLOBAL AND ROBUST
window.logout = function () {
    console.log('Logging out...');
    localStorage.removeItem('user');
    location.href = '/'; // Hard reload to root
};

// Global Tab Navigation
window.switchTab = function (tabId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });
    // Refresh specific views
    if (tabId === 'stock') fetchStockDetails();
    if (tabId === 'actions') {
        fetchPoints();
        fetchCouriers();
    }
};

window.toggleAuth = function (mode) {
    if (mode === 'register') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('register-section').style.display = 'block';
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('register-section').style.display = 'none';
    }
};

// --- AUTHENTICATION ---
function checkLogin() {
    try {
        const user = localStorage.getItem('user');
        if (user) {
            document.getElementById('view-login').style.display = 'none';
            document.getElementById('main-app').style.display = 'block';
            return true;
        } else {
            document.getElementById('view-login').style.display = 'flex';
            document.getElementById('main-app').style.display = 'none';
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Entrando...';
    btn.disabled = true;

    const username = e.target.username.value;
    const password = e.target.password.value;

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                showToast('Login realizado com sucesso!', 'success');
                checkLogin();
                loadApp();
            } else {
                showToast(data.error || 'Credenciais inválidas', 'error');
            }
        })
        .catch(() => showToast('Erro de conexão. Verifique se o servidor está rodando.', 'error'))
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
}

function handleRegister(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                showToast('Conta criada! Faça login.', 'success');
                toggleAuth('login');
                const loginInput = document.querySelector('#login-form input[name="username"]');
                if (loginInput) loginInput.value = username;
            } else {
                showToast(data.error || 'Erro ao cadastrar', 'error');
            }
        })
        .catch(() => showToast('Erro de conexão', 'error'));
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Ready');

    // Login Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Register Handling
    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    // Initial Check
    if (checkLogin()) {
        loadApp();
    }
});

function loadApp() {
    console.log('Loading app data...');
    try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user) showToast(`Bem-vindo, ${user.username}!`, 'success');

        fetchGoldTypes().catch(e => console.error(e));
        fetchPoints().catch(e => console.error(e));
        fetchCouriers().catch(e => console.error(e));
        updateStats().catch(e => console.error(e));
        updateTransactions().catch(e => console.error(e));
        loadChart().catch(e => console.error(e));
        setupEventListeners();
    } catch (e) {
        console.error(e);
        showToast('Erro ao carregar aplicação', 'error');
    }
}

// --- DATA FETCHING & UI ---
async function fetchPoints() {
    try {
        const res = await fetch(`${API_URL}/points`);
        const points = await res.json();
        const selects = document.querySelectorAll('.point-select');
        selects.forEach(sel => {
            const current = sel.value;
            sel.innerHTML = points.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            if (current) sel.value = current;
        });
        const list = document.getElementById('points-list');
        if (list) {
            list.innerHTML = points.map(p => `<li><strong>${p.name}</strong> - ${p.address}</li>`).join('');
        }
    } catch (e) { console.error(e); }
}

async function fetchCouriers() {
    try {
        const res = await fetch(`${API_URL}/couriers`);
        const couriers = await res.json();
        const selects = document.querySelectorAll('.courier-select');
        selects.forEach(sel => {
            sel.innerHTML = '<option value="">Selecione...</option>' +
                couriers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        });
        const list = document.getElementById('couriers-list');
        if (list) {
            list.innerHTML = couriers.map(c => `<li>${c.name} (${c.phone || '-'}) - Taxa: R$ ${c.default_fee || 0}</li>`).join('');
        }
    } catch (e) { console.error(e); }
}

async function fetchStockDetails() {
    const container = document.getElementById('stock-details-container');
    if (!container) return;
    container.innerHTML = '<p>Carregando...</p>';
    try {
        const res = await fetch(`${API_URL}/stock-details`);
        const data = await res.json();
        let html = '';
        for (const [point, goldMap] of Object.entries(data)) {
            html += `<div style="margin-bottom: 2rem; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 12px;"><h3 style="color: var(--accent-secondary); margin-bottom: 1rem;">📍 ${point}</h3><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">`;
            for (const [gold, quantity] of Object.entries(goldMap)) {
                html += `<div style="background: rgba(15, 23, 42, 0.8); padding: 1rem; border-radius: 8px; text-align: center;"><div style="font-size: 0.9rem; color: var(--text-secondary);">${gold}</div><div style="font-size: 1.2rem; font-weight: bold;">${quantity.toFixed(2)} g</div></div>`;
            }
            html += `</div></div>`;
        }
        container.innerHTML = html || '<p>Sem estoque registrado.</p>';
    } catch (e) {
        container.innerHTML = '<p style="color:red">Erro ao carregar estoque.</p>';
    }
}

function setupEventListeners() {
    const modal = document.getElementById('type-modal');
    const btnAddType = document.getElementById('btn-add-type');
    const closeModalType = document.getElementById('close-type');
    if (btnAddType) btnAddType.onclick = () => modal.style.display = 'flex';
    if (closeModalType) closeModalType.onclick = () => modal.style.display = 'none';

    const adjustModal = document.getElementById('adjust-modal');
    const btnAdjust = document.getElementById('btn-adjust-stock');
    const closeAdjust = document.getElementById('close-adjust');
    if (btnAdjust) btnAdjust.onclick = () => adjustModal.style.display = 'flex';
    if (closeAdjust) closeAdjust.onclick = () => adjustModal.style.display = 'none';

    const editModal = document.getElementById('edit-modal');
    const closeEditModal = document.getElementById('close-edit');
    if (closeEditModal) closeEditModal.onclick = () => editModal.style.display = 'none';

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
        if (event.target == editModal) editModal.style.display = 'none';
        if (event.target == adjustModal) adjustModal.style.display = 'none';
    }

    const deliveryCheck = document.getElementById('delivery-check');
    if (deliveryCheck) {
        deliveryCheck.addEventListener('change', function () {
            document.getElementById('delivery-fields').style.display = this.checked ? 'block' : 'none';
        });
    }

    const dateInputs = document.querySelectorAll('input[name="date"]');
    dateInputs.forEach(input => input.valueAsDate = new Date());

    document.getElementById('type-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitForm(`${API_URL}/gold-types`, { name: e.target.type_name.value }, () => {
            showToast('Categoria adicionada!', 'success');
            modal.style.display = 'none';
            e.target.reset();
            fetchGoldTypes();
        });
    });

    document.getElementById('point-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = { name: e.target.name.value, address: e.target.address.value };
        submitForm(`${API_URL}/points`, payload, () => {
            showToast('Ponto adicionado!', 'success');
            e.target.reset();
            fetchPoints();
        });
    });

    document.getElementById('courier-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: e.target.name.value,
            phone: e.target.phone.value,
            default_fee: e.target.default_fee.value
        };
        submitForm(`${API_URL}/couriers`, payload, () => {
            showToast('Motoboy adicionado!', 'success');
            e.target.reset();
            fetchCouriers();
        });
    });

    document.getElementById('adjust-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        submitForm(`${API_URL}/stock-correction`, Object.fromEntries(formData), () => {
            showToast('Estoque ajustado!', 'success');
            adjustModal.style.display = 'none';
            e.target.reset();
            updateStats();
            updateTransactions();
        });
    });

    document.getElementById('buy-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const weight = getWeightInGrams(e.target);
        const payload = new FormData();
        payload.append('point_id', formData.get('point_id'));
        payload.append('gold_type_id', formData.get('gold_type'));
        payload.append('weight_grams', weight);
        payload.append('price', formData.get('price'));
        payload.append('customer_name', formData.get('customer'));

        fetch(`${API_URL}/buy`, { method: 'POST', body: payload })
            .then(res => {
                if (res.ok) {
                    showToast('Entrada registrada!', 'success');
                    e.target.reset();
                    updateStats();
                    updateTransactions();
                } else {
                    res.json().then(d => showToast(d.error, 'error'));
                }
            })
            .catch(() => showToast('Erro de conexão', 'error'));
    });

    document.getElementById('sell-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const weight = getWeightInGrams(e.target);
        const payload = new FormData();
        payload.append('point_id', formData.get('point_id'));
        payload.append('gold_type_id', formData.get('gold_type'));
        payload.append('weight_grams', weight);
        payload.append('price', formData.get('price'));
        payload.append('customer_name', formData.get('customer'));
        payload.append('date', formData.get('date'));

        if (document.getElementById('delivery-check').checked) {
            payload.append('delivery_courier', formData.get('delivery_courier'));
            payload.append('courier_id', formData.get('courier_id'));
            payload.append('delivery_cost', formData.get('delivery_cost'));
            payload.append('delivery_time', formData.get('delivery_time'));
        }

        fetch(`${API_URL}/sell`, { method: 'POST', body: payload })
            .then(res => {
                if (res.ok) {
                    showToast('Saída registrada!', 'success');
                    e.target.reset();
                    document.getElementById('delivery-fields').style.display = 'none';
                    updateStats();
                    updateTransactions();
                    loadChart();
                } else {
                    res.json().then(d => showToast(d.error, 'error'));
                }
            })
            .catch(() => showToast('Erro de conexão', 'error'));
    });

    document.getElementById('report-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const start = e.target.start_date.value;
        const end = e.target.end_date.value;
        try {
            const res = await fetch(`${API_URL}/transactions`);
            const transactions = await res.json();
            const filtered = transactions.filter(tx => {
                const txDate = tx.date.split('T')[0];
                return txDate >= start && txDate <= end;
            });
            generatePrintableReport(filtered, start, end);
        } catch (err) { console.error(err); }
    });
}

// --- HELPERS ---

async function submitForm(url, data, onSuccess) {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) onSuccess();
        else showToast('Erro ao salvar', 'error');
    } catch (e) { showToast('Erro de conexão', 'error'); }
}

function getWeightInGrams(form) {
    let weight = parseFloat(form.weight.value);
    if (form.unit.value === 'kg') weight *= 1000;
    return weight;
}

function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

async function fetchGoldTypes() {
    try {
        const res = await fetch(`${API_URL}/gold-types`);
        const types = await res.json();
        const selects = document.querySelectorAll('.gold-type-select');
        selects.forEach(sel => {
            const cur = sel.value;
            sel.innerHTML = '<option value="" disabled selected>Selecione...</option>' +
                types.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
            if (cur) sel.value = cur;
        });
    } catch (e) { console.error(e); }
}

// Updated Stats Logic
async function updateStats() {
    try {
        const [invRes, txRes] = await Promise.all([
            fetch(`${API_URL}/inventory`),
            fetch(`${API_URL}/transactions`)
        ]);
        const inventory = await invRes.json();
        const transactions = await txRes.json();

        let balance = 0;
        transactions.forEach(tx => {
            if (tx.type === 'SELL') balance += (tx.price - (tx.delivery_cost || 0));
            else if (tx.type === 'BUY') balance -= tx.price;
        });

        const container = document.getElementById('stats-container');
        if (container) {
            container.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value" style="color: ${balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}">
                        ${formatCurrency(balance)}
                    </div>
                    <div class="stat-label">Saldo Caixa</div>
                </div>
            `;
            // Add Top 3 Stock Items
            Object.values(inventory).slice(0, 3).forEach(item => {
                // Ensure item has needed props
                if (item.stock !== undefined) {
                    container.innerHTML += `
                        <div class="stat-card">
                            <div class="stat-value" style="color: var(--text-primary);">${item.stock.toFixed(2)} g</div>
                            <div class="stat-label">Estoque</div> 
                        </div>
                    `;
                }
            });
            // Fix inventory loop - inventory from server is object { "Type": { stock: n, ... }, ... }
            const items = Object.entries(inventory);
            items.forEach(([key, val]) => {
                container.innerHTML += `
                    <div class="stat-card">
                        <div class="stat-value" style="color: var(--text-primary);">${val.stock.toFixed(2)} g</div>
                        <div class="stat-label">${key}</div> 
                    </div>
                `;
            });
        }
    } catch (e) { console.error(e); }
}

async function updateTransactions() {
    try {
        const res = await fetch(`${API_URL}/transactions`);
        const txs = await res.json();
        const tbody = document.getElementById('transactions-body');
        if (!tbody) return;
        tbody.innerHTML = txs.map(tx => {
            const isBuy = tx.type === 'BUY';
            const badge = tx.customer_name?.includes('AJUSTE')
                ? '<span class="badge" style="background:#64748b; color:#fff">AJUSTE</span>'
                : (isBuy ? '<span class="badge badge-buy">ENTRADA</span>' : '<span class="badge badge-sell">SAÍDA</span>');

            return `
                <tr>
                    <td>${formatDate(tx.date)}</td>
                    <td>${badge}</td>
                    <td>${tx.gold_type_name || '-'}</td>
                    <td>${tx.customer_name || '-'}</td>
                    <td>${tx.weight_grams.toFixed(2)}</td>
                    <td>${formatCurrency(tx.price)}</td>
                    <td>${tx.delivery_courier ? `<small>${tx.delivery_courier}</small>` : '-'}</td>
                    <td><button class="btn-icon">✏️</button></td> 
                </tr>
            `;
        }).join('');
    } catch (e) { console.error(e); }
}

async function loadChart() {
    try {
        const res = await fetch(`${API_URL}/analytics`);
        const data = await res.json();
        const ctx = document.getElementById('movementChart');
        if (!ctx) return;

        if (window.myChart) window.myChart.destroy();
        window.myChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    { label: 'Vendas', data: data.soldData, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true },
                    { label: 'Entradas', data: data.boughtData, borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', fill: true }
                ]
            },
            options: { responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
        });
    } catch (e) { console.error(e); }
}

function generatePrintableReport(transactions, start, end) {
    const buying = transactions.filter(tx => tx.type === 'BUY' && !tx.customer_name?.includes('AJUSTE:'));
    const selling = transactions.filter(tx => tx.type === 'SELL' && !tx.customer_name?.includes('AJUSTE:'));

    const html = `
    <html>
    <head>
        <title>Relatório - ${formatDate(start)}</title>
        <style>body { font-family: sans-serif; padding: 20px; } table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; } th, td { border: 1px solid #ddd; padding: 6px; } th { background: #f0f0f0; } .total { text-align: right; font-weight: bold; margin-top: 5px; }</style>
    </head>
    <body>
        <h1>Relatório de Movimentação (${formatDate(start)} - ${formatDate(end)})</h1>
        <h2>Entradas</h2>
        <table>
            <thead><tr><th>Data</th><th>Item</th><th>Qtd</th><th>Valor</th><th>Fornecedor</th></tr></thead>
            <tbody>${buying.map(tx => `<tr><td>${formatDate(tx.date)}</td><td>${tx.gold_type_name}</td><td>${tx.weight_grams}</td><td>${formatCurrency(tx.price)}</td><td>${tx.customer_name}</td></tr>`).join('')}</tbody>
        </table>
        <div class="total">Total Entradas: ${formatCurrency(buying.reduce((a, t) => a + t.price, 0))}</div>

        <h2>Saídas</h2>
        <table>
            <thead><tr><th>Data</th><th>Item</th><th>Qtd</th><th>Valor</th><th>Cliente</th></tr></thead>
            <tbody>${selling.map(tx => `<tr><td>${formatDate(tx.date)}</td><td>${tx.gold_type_name}</td><td>${tx.weight_grams}</td><td>${formatCurrency(tx.price)}</td><td>${tx.customer_name}</td></tr>`).join('')}</tbody>
        </table>
        <div class="total">Total Saídas: ${formatCurrency(selling.reduce((a, t) => a + t.price, 0))}</div>
        
        <br>
        <strong>Lucro Bruto: ${formatCurrency(selling.reduce((a, t) => a + t.price, 0) - buying.reduce((a, t) => a + t.price, 0))}</strong>
        <script>window.print();</script>
    </body>
    </html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
}
