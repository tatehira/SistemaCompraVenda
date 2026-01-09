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
        loadChart().catch(e => console.error(e));
        applyUserPreferences();
        setupEventListeners();
    } catch (e) {
        console.error(e);
        showToast('Erro ao carregar aplicação', 'error');
    }
}

// --- DATA FETCHING & UI ---
// --- HELPER TO GET USER ID ---
function getUserId() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.id : null;
    } catch (e) { return null; }
}

// --- DATA FETCHING & UI ---
async function fetchPoints() {
    try {
        const userId = getUserId();
        if (!userId) return;
        const res = await fetch(`${API_URL}/points?user_id=${userId}`);
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
        const userId = getUserId();
        if (!userId) return;
        const res = await fetch(`${API_URL}/couriers?user_id=${userId}`);
        const couriers = await res.json();
        const selects = document.querySelectorAll('.courier-select');
        selects.forEach(sel => {
            sel.innerHTML = '<option value="">Selecione...</option>' +
                couriers.map(c => `<option value="${c.id}" data-fee="${c.default_fee || 0}">${c.name}</option>`).join('');
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
    const userId = getUserId();
    if (!userId) return;

    container.innerHTML = '<p>Carregando...</p>';
    try {
        const res = await fetch(`${API_URL}/stock-details?user_id=${userId}`);
        const data = await res.json();
        let html = '';
        const pointsData = {};

        // We need IDs to query history. The current endpoint only returns aggregated names.
        // I need to update the endpoint or logic.
        // Wait, the endpoint returns: { PointName: { GoldName: Qty } }. This is lossy.
        // I should probably fetch ALL stock rows with IDs.
        // For now, I will use PointName and GoldName to filter client-side or duplicate the fetch.
        // Actually, let's keep it simple: Pass names to a filter function since we have a 'transactions' list available or fetch it.

        for (const [point, goldMap] of Object.entries(data)) {
            html += `<div style="margin-bottom: 2rem; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 12px;">
                        <h3 style="color: var(--accent-secondary); margin-bottom: 1rem;">📍 ${point}</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">`;

            for (const [gold, quantity] of Object.entries(goldMap)) {
                html += `<div onclick="openStockHistory('${point}', '${gold}')" 
                              style="background: rgba(15, 23, 42, 0.8); padding: 1rem; border-radius: 8px; text-align: center; cursor: pointer; transition: transform 0.2s;"
                              onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">${gold}</div>
                            <div style="font-size: 1.2rem; font-weight: bold;">${quantity.toFixed(2)} g</div>
                         </div>`;
            }
            html += `</div></div>`;
        }
        container.innerHTML = html || '<p>Sem estoque registrado.</p>';
    } catch (e) {
        container.innerHTML = '<p style="color:red">Erro ao carregar estoque.</p>';
    }
}

// --- STOCK HISTORY (New) ---
async function openStockHistory(pointName, goldName) {
    const modal = document.getElementById('stock-item-modal');
    const title = document.getElementById('stock-item-title');
    const content = document.getElementById('stock-item-history');

    modal.style.display = 'flex';
    title.innerText = `${goldName} em ${pointName}`;
    content.innerHTML = '<p>Carregando histórico...</p>';

    try {
        const userId = getUserId();
        const res = await fetch(`${API_URL}/transactions?user_id=${userId}`);
        const allTxs = await res.json(); // Not efficient for large data, but works for now.

        // Filter by Point Name and Gold Name (Not IDs? server returns names joined)
        // Check filtering logic.
        // Transactions endpoint returns: point_id (int), gold_type_id (int).
        // AND it joins gold_type_name. BUT it does NOT join point_name by default in the list endpoint?
        // Let's check server.js... /api/transactions only joins gold_types. Point is ID.
        // Problem: Point Name in stock-details comes from a join.
        // I need to match Point Name. Or better, fix stock-details to return IDs too.

        // Quick fix: Client side match is risky if names change.
        // Let's matching by ID is better. But I don't have IDs in the loop above easily unless I change backend.
        // Let's fetch Points to match ID.

        const pointsRes = await fetch(`${API_URL}/points?user_id=${userId}`);
        const points = await pointsRes.json();
        const pointObj = points.find(p => p.name === pointName);

        const filtered = allTxs.filter(tx => {
            return (tx.gold_type_name === goldName) &&
                (pointObj ? tx.point_id === pointObj.id : true);
        });

        if (filtered.length === 0) {
            content.innerHTML = '<p>Nenhuma movimentação encontrada.</p>';
            return;
        }

        content.innerHTML = `
            <table style="width:100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9rem;">
                <thead style="background: rgba(255,255,255,0.1);">
                    <tr><th>Data</th><th>Tipo</th><th>Qtd</th><th>Valor</th><th>Cliente</th></tr>
                </thead>
                <tbody>
                    ${filtered.map(tx => `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">${formatDate(tx.date)}</td>
                            <td style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); color: ${tx.type === 'BUY' ? 'var(--success-color)' : 'var(--danger-color)'}">${tx.type === 'BUY' ? 'ENTRADA' : 'SAÍDA'}</td>
                            <td style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">${tx.weight_grams}</td>
                            <td style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">${formatCurrency(tx.price)}</td>
                            <td style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">${tx.customer_name || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (e) {
        console.error(e);
        content.innerHTML = '<p style="color:red">Erro ao carregar detalhes.</p>';
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

    const stockItemModal = document.getElementById('stock-item-modal');
    const closeStockItem = document.getElementById('close-stock-item');
    if (closeStockItem) closeStockItem.onclick = () => stockItemModal.style.display = 'none';

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
        if (event.target == editModal) editModal.style.display = 'none';
        if (event.target == adjustModal) adjustModal.style.display = 'none';
        if (event.target == stockItemModal) stockItemModal.style.display = 'none';
    }

    const deliveryCheck = document.getElementById('delivery-check');
    if (deliveryCheck) {
        deliveryCheck.addEventListener('change', function () {
            document.getElementById('delivery-fields').style.display = this.checked ? 'block' : 'none';
        });
    }

    const dateInputs = document.querySelectorAll('input[name="date"]');
    dateInputs.forEach(input => input.valueAsDate = new Date());

    // Settings Modal Logic
    const settingsLink = document.getElementById('settings-link'); // Need to add this to HTML
    const settingsModal = document.getElementById('settings-modal'); // Need to add this to HTML
    const closeSettings = document.getElementById('close-settings');
    const settingsForm = document.getElementById('settings-form');

    if (settingsLink) {
        settingsLink.onclick = (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                document.getElementById('settings-unit').value = user.preferred_unit || 'g';
            }
            settingsModal.style.display = 'flex';
        };
    }
    if (closeSettings) closeSettings.onclick = () => settingsModal.style.display = 'none';

    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const unit = document.getElementById('settings-unit').value;
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            fetch(`${API_URL}/user/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id, preferred_unit: unit })
            })
                .then(res => res.json())
                .then(data => {
                    showToast('Configurações salvas!', 'success');
                    user.preferred_unit = unit;
                    localStorage.setItem('user', JSON.stringify(user));
                    settingsModal.style.display = 'none';
                    applyUserPreferences();
                })
                .catch(() => showToast('Erro ao salvar', 'error'));
        });
    }

    if (window.onclick) {
        // Merge with existing logic if possible, or just append check
        const oldClick = window.onclick;
        window.onclick = (event) => {
            oldClick(event);
            if (event.target == settingsModal) settingsModal.style.display = 'none';
        }
    }


    document.getElementById('type-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitForm(`${API_URL}/gold-types`, { name: e.target.type_name.value, user_id: getUserId() }, () => {
            showToast('Categoria adicionada!', 'success');
            modal.style.display = 'none';
            e.target.reset();
            fetchGoldTypes();
        });
    });

    document.getElementById('point-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: e.target.name.value,
            address: e.target.address.value,
            user_id: getUserId()
        };
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
            default_fee: e.target.default_fee.value,
            user_id: getUserId()
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
        formData.append('user_id', getUserId());
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
        payload.append('user_id', getUserId());

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
        payload.append('user_id', getUserId());

        if (document.getElementById('delivery-check').checked) {
            const courierId = formData.get('courier_id');
            if (courierId) {
                payload.append('courier_id', courierId);
                // Look up fee from DOM or Fetch? DOM is faster if we store it.
                // Let's refetch or stick it in option dataset.
                const select = e.target.querySelector('.courier-select');
                const option = select.options[select.selectedIndex];
                const fee = option.dataset.fee || 0;
                payload.append('delivery_cost', fee);
                payload.append('delivery_courier', option.text); // Use name as text fallback
            }
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
        const userId = getUserId();
        if (!userId) return;

        try {
            const res = await fetch(`${API_URL}/transactions?user_id=${userId}`);
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
    const unit = form.unit.value; // Now this comes from the select, which defaults to pref
    if (unit === 'kg') weight *= 1000;
    // if unit is 'g', weight is weight.
    return weight;
}

function applyUserPreferences() {
    const user = JSON.parse(localStorage.getItem('user'));
    const unit = user ? (user.preferred_unit || 'g') : 'g';

    // Update all unit selects
    document.querySelectorAll('select[name="unit"]').forEach(sel => {
        sel.value = unit;
    });
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
        const userId = getUserId();
        if (!userId) return;
        const res = await fetch(`${API_URL}/gold-types?user_id=${userId}`);
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
        const userId = getUserId();
        if (!userId) return;
        const [invRes, txRes] = await Promise.all([
            fetch(`${API_URL}/inventory?user_id=${userId}`),
            fetch(`${API_URL}/transactions?user_id=${userId}`)
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
        const userId = getUserId();
        if (!userId) return;
        const res = await fetch(`${API_URL}/transactions?user_id=${userId}`);
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
        const userId = getUserId();
        if (!userId) return;
        const res = await fetch(`${API_URL}/analytics?user_id=${userId}`);
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
