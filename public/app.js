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

// Global Tab Navigation
window.switchTab = function (tabId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    // Remove active class from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected view
    document.getElementById(`view-${tabId}`).classList.add('active');

    // Highlight button
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });
};

// Open Edit Modal
window.openEditModal = function (tx) {
    const editModal = document.getElementById('edit-modal');
    const form = document.getElementById('edit-form');

    form.id.value = tx.id;
    form.type.value = tx.type;
    form.date.value = tx.date.split('T')[0];
    form.gold_type_id.value = tx.gold_type_id;
    form.weight_grams.value = tx.weight_grams;
    form.price.value = tx.price;
    form.customer_name.value = tx.customer_name || '';

    if (tx.type === 'SELL') {
        document.getElementById('edit-sale-fields').style.display = 'block';
        form.delivery_courier.value = tx.delivery_courier || '';
        form.delivery_cost.value = tx.delivery_cost || '';
        form.delivery_time.value = tx.delivery_time || '';
    } else {
        document.getElementById('edit-sale-fields').style.display = 'none';
        form.delivery_courier.value = '';
        form.delivery_cost.value = '';
        form.delivery_time.value = '';
    }
    editModal.style.display = 'flex';
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial Load
    fetchGoldTypes();
    updateStats();
    updateTransactions();
    loadChart();

    // -- Modal Logic --
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

    // Global Click to Close Modals
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
        if (event.target == editModal) editModal.style.display = 'none';
        if (event.target == adjustModal) adjustModal.style.display = 'none';
    }

    // Toggle delivery fields
    const deliveryCheck = document.getElementById('delivery-check');
    if (deliveryCheck) {
        deliveryCheck.addEventListener('change', function () {
            document.getElementById('delivery-fields').style.display = this.checked ? 'block' : 'none';
        });
    }

    // Set Date Default
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput) dateInput.valueAsDate = new Date();

    // -- Forms Submission --

    // Add New Type
    const typeForm = document.getElementById('type-form');
    if (typeForm) {
        typeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = e.target.type_name.value;
            try {
                const res = await fetch(`${API_URL}/gold-types`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                });
                if (res.ok) {
                    showToast('Categoria adicionada!', 'success');
                    modal.style.display = 'none';
                    e.target.reset();
                    fetchGoldTypes();
                } else {
                    showToast('Erro ao salvar.', 'error');
                }
            } catch (err) {
                showToast('Erro de conexão.', 'error');
            }
        });
    }

    // Adjust Stock
    const adjustForm = document.getElementById('adjust-form');
    if (adjustForm) {
        adjustForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const payload = Object.fromEntries(formData.entries());
            try {
                const res = await fetch(`${API_URL}/stock-correction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    showToast('Estoque ajustado!', 'success');
                    adjustModal.style.display = 'none';
                    e.target.reset();
                    updateStats();
                    updateTransactions();
                } else {
                    showToast('Erro ao ajustar.', 'error');
                }
            } catch (err) {
                showToast('Erro de conexão.', 'error');
            }
        });
    }

    // Buy Form
    const buyForm = document.getElementById('buy-form');
    if (buyForm) {
        buyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const weightGrams = getWeightInGrams(e.target);
            const payload = new FormData();
            payload.append('gold_type_id', formData.get('gold_type'));
            payload.append('weight_grams', weightGrams);
            payload.append('price', formData.get('price'));
            payload.append('customer_name', formData.get('customer'));
            if (formData.get('receipt') && formData.get('receipt').size > 0) payload.append('receipt', formData.get('receipt'));

            try {
                const res = await fetch(`${API_URL}/buy`, { method: 'POST', body: payload });
                if (res.ok) {
                    showToast('Entrada registrada!', 'success');
                    e.target.reset();
                    updateStats();
                    updateTransactions();
                } else {
                    const err = await res.json();
                    showToast('Erro: ' + err.error, 'error');
                }
            } catch (error) {
                showToast('Erro de conexão.', 'error');
            }
        });
    }

    // Sell Form
    const sellForm = document.getElementById('sell-form');
    if (sellForm) {
        sellForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const weightGrams = getWeightInGrams(e.target);
            const payload = new FormData();
            payload.append('gold_type_id', formData.get('gold_type'));
            payload.append('customer_name', formData.get('customer'));
            payload.append('weight_grams', weightGrams);
            payload.append('price', formData.get('price'));
            payload.append('date', formData.get('date'));
            if (document.getElementById('delivery-check').checked) {
                payload.append('delivery_courier', formData.get('delivery_courier'));
                payload.append('delivery_cost', formData.get('delivery_cost'));
                payload.append('delivery_time', formData.get('delivery_time'));
            }
            if (formData.get('receipt') && formData.get('receipt').size > 0) payload.append('receipt', formData.get('receipt'));

            try {
                const res = await fetch(`${API_URL}/sell`, { method: 'POST', body: payload });
                if (res.ok) {
                    showToast('Saída registrada!', 'success');
                    e.target.reset();
                    document.querySelector('input[name="date"]').valueAsDate = new Date();
                    document.getElementById('delivery-fields').style.display = 'none';
                    updateStats();
                    updateTransactions();
                    loadChart();
                } else {
                    const err = await res.json();
                    showToast('Erro: ' + err.error, 'error');
                }
            } catch (error) {
                showToast('Erro de conexão.', 'error');
            }
        });
    }

    // Edit Form
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const id = formData.get('id');
            const payload = {};
            formData.forEach((value, key) => payload[key] = value);
            try {
                const res = await fetch(`${API_URL}/transactions/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    showToast('Atualizado com sucesso!', 'success');
                    editModal.style.display = 'none';
                    updateStats();
                    updateTransactions();
                } else {
                    showToast('Erro ao atualizar.', 'error');
                }
            } catch (err) {
                showToast('Erro de conexão.', 'error');
            }
        });
    }

    // Report Form
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
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

            } catch (err) {
                showToast('Erro ao gerar relatório.', 'error');
            }
        });
    }

}); // End DOMContentLoaded

// -- Helper Functions --

function formatCurrency(value) {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function getWeightInGrams(form) {
    let weight = parseFloat(form.weight.value);
    const unit = form.unit.value;
    if (unit === 'kg') {
        weight = weight * 1000;
    }
    return weight;
}

// Function to populate Gold Type dropdowns
async function fetchGoldTypes() {
    try {
        const response = await fetch(`${API_URL}/gold-types`);
        const types = await response.json();
        const selects = document.querySelectorAll('.gold-type-select');
        selects.forEach(select => {
            const currentVal = select.value;
            select.innerHTML = '<option value="" disabled selected>Selecione...</option>';
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                select.appendChild(option);
            });
            if (currentVal) select.value = currentVal;
        });
    } catch (error) {
        console.error('Error fetching types', error);
    }
}

// Update Stats
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
            if (tx.type === 'SELL') {
                balance += (tx.price - (tx.delivery_cost || 0));
            } else if (tx.type === 'BUY') {
                balance -= tx.price;
            }
        });

        const container = document.getElementById('stats-container');
        if (!container) return;
        container.innerHTML = '';

        // Balance Card
        const balanceCard = document.createElement('div');
        balanceCard.className = 'stat-card';
        balanceCard.innerHTML = `
            <div class="stat-value" style="color: ${balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}">
                ${formatCurrency(balance)}
            </div>
            <div class="stat-label">Saldo Caixa</div>
        `;
        container.appendChild(balanceCard);

        // Inventory Cards
        inventory.forEach(item => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `
                <div class="stat-value" style="color: var(--text-primary);">${item.total_weight.toFixed(2)} g</div>
                <div class="stat-label">${item.type_name}</div>
            `;
            container.appendChild(card);
        });

    } catch (err) { console.error(err); }
}

// Update Transactions
async function updateTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions`);
        const transactions = await response.json();
        const tbody = document.getElementById('transactions-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        transactions.forEach(tx => {
            const tr = document.createElement('tr');
            const isBuy = tx.type === 'BUY';
            let typeBadge = '';
            if (tx.customer_name && tx.customer_name.includes('AJUSTE:')) {
                typeBadge = '<span class="badge" style="background:#64748b; color:#fff">AJUSTE</span>';
            } else {
                typeBadge = isBuy
                    ? '<span class="badge badge-buy">ENTRADA</span>'
                    : '<span class="badge badge-sell">SAÍDA</span>';
            }

            const receiptHtml = tx.receipt_path
                ? `<a href="/${tx.receipt_path}" target="_blank" style="color:var(--accent-primary)">Ver</a>`
                : '-';

            let deliveryInfo = '-';
            if (tx.delivery_courier) {
                deliveryInfo = `<small>${tx.delivery_courier}<br>${tx.delivery_time || ''}</small>`;
            }

            const txData = encodeURIComponent(JSON.stringify(tx));

            tr.innerHTML = `
                <td>${formatDate(tx.date)}</td>
                <td>${typeBadge}</td>
                <td>${tx.gold_type_name || '-'}</td>
                <td>${tx.customer_name || '-'}</td>
                <td>${tx.weight_grams.toFixed(2)}</td>
                <td>${formatCurrency(tx.price)}</td>
                <td>${deliveryInfo}</td>
                <td>
                    <button class="btn-icon" onclick="openEditModal(JSON.parse(decodeURIComponent('${txData}')))">
                        ✏️
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) { console.error(err); }
}

// Load Chart
async function loadChart() {
    try {
        const res = await fetch(`${API_URL}/analytics`);
        const data = await res.json();
        const ctx = document.getElementById('movementChart').getContext('2d');
        if (window.myChart) window.myChart.destroy();

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Vendas (Qtd)',
                        data: data.soldData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Entradas (Qtd)',
                        data: data.boughtData,
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            }
        });
    } catch (err) { console.error(err); }
}

// Generate Report
function generatePrintableReport(transactions, start, end) {
    const buying = transactions.filter(tx => tx.type === 'BUY' && !tx.customer_name?.includes('AJUSTE:'));
    const selling = transactions.filter(tx => tx.type === 'SELL' && !tx.customer_name?.includes('AJUSTE:'));
    const adjustments = transactions.filter(tx => tx.customer_name?.includes('AJUSTE:'));

    let html = `
    <html>
    <head>
        <title>Relatório - ${formatDate(start)} a ${formatDate(end)}</title>
        <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { font-size: 20px; margin-bottom: 5px; }
            h2 { font-size: 16px; margin-top: 20px; border-bottom: 2px solid #ccc; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background: #f0f0f0; }
            .total { font-weight: bold; text-align: right; margin-top: 5px; }
            .summary { display: flex; gap: 20px; margin-top: 20px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; }
        </style>
    </head>
    <body>
        <h1>Relatório de Movimentação</h1>
        <p>Período: ${formatDate(start)} até ${formatDate(end)}</p>

        <h2>Entradas</h2>
        <table>
            <thead><tr><th>Data</th><th>Item</th><th>Qtd</th><th>Valor</th><th>Fornecedor</th></tr></thead>
            <tbody>
                ${buying.map(tx => `<tr><td>${formatDate(tx.date)}</td><td>${tx.gold_type_name}</td><td>${tx.weight_grams}</td><td>${formatCurrency(tx.price)}</td><td>${tx.customer_name}</td></tr>`).join('')}
            </tbody>
        </table>
        <div class="total">Total: ${formatCurrency(buying.reduce((acc, tx) => acc + tx.price, 0))}</div>

        <h2>Saídas</h2>
        <table>
            <thead><tr><th>Data</th><th>Item</th><th>Qtd</th><th>Valor</th><th>Cliente</th><th>Entrega</th></tr></thead>
            <tbody>
                ${selling.map(tx => `<tr><td>${formatDate(tx.date)}</td><td>${tx.gold_type_name}</td><td>${tx.weight_grams}</td><td>${formatCurrency(tx.price)}</td><td>${tx.customer_name}</td><td>${tx.delivery_courier ? 'Sim' : '-'}</td></tr>`).join('')}
            </tbody>
        </table>
        <div class="total">Total: ${formatCurrency(selling.reduce((acc, tx) => acc + tx.price, 0))}</div>
        
        <div class="summary">
            <strong>Lucro Bruto: ${formatCurrency(selling.reduce((acc, tx) => acc + tx.price, 0) - buying.reduce((acc, tx) => acc + tx.price, 0))}</strong>
        </div>
        <script>window.print();</script>
    </body>
    </html>
    `;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
}
