const API_URL = 'http://localhost:3000/api';

// Format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

// Setup Date input default to today
document.querySelector('input[name="date"]').valueAsDate = new Date();

// Delivery Toggle Logic
const deliveryCheck = document.getElementById('delivery-check');
const deliveryFields = document.getElementById('delivery-fields');
if (deliveryCheck) {
    deliveryCheck.addEventListener('change', (e) => {
        deliveryFields.style.display = e.target.checked ? 'block' : 'none';
    });
}

// Global Gold Types Cache
let goldTypes = [];

// Fetch Gold Types
async function fetchGoldTypes() {
    try {
        const response = await fetch(`${API_URL}/gold-types`);
        goldTypes = await response.json();
        populateTypeSelects();
    } catch (error) {
        console.error('Error fetching gold types:', error);
    }
}

function populateTypeSelects() {
    const selects = document.querySelectorAll('.gold-type-select');
    selects.forEach(select => {
        select.innerHTML = '<option value="" disabled selected>Selecione o Tipo...</option>';
        goldTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            //option.textContent = type.name;
            // Show only name or maybe append something later
            option.textContent = type.name;
            select.appendChild(option);
        });
    });
}

// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Modal Logic
const modal = document.getElementById('type-modal');
const btnAddType = document.getElementById('btn-add-type');
const closeModalType = document.getElementById('close-type');

btnAddType.onclick = () => modal.style.display = 'flex';
closeModalType.onclick = () => modal.style.display = 'none';

// Edit Modal Logic
const editModal = document.getElementById('edit-modal');
const closeEditModal = document.getElementById('close-edit');

closeEditModal.onclick = () => editModal.style.display = 'none';

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
    if (event.target == editModal) editModal.style.display = 'none';
}

function openEditModal(tx) {
    const form = document.getElementById('edit-form');
    form.id.value = tx.id;
    form.type.value = tx.type;

    // Date format for input: YYYY-MM-DD
    form.date.value = tx.date.split('T')[0];
    form.gold_type_id.value = tx.gold_type_id;
    form.weight_grams.value = tx.weight_grams;
    form.price.value = tx.price;
    form.customer_name.value = tx.customer_name || '';

    if (tx.type === 'SELL') {
        document.getElementById('edit-sale-fields').style.display = 'block';
        form.delivery_courier.value = tx.delivery_courier || '';
        form.delivery_cost.value = tx.delivery_cost || '';
    } else {
        document.getElementById('edit-sale-fields').style.display = 'none';
        form.delivery_courier.value = '';
        form.delivery_cost.value = '';
    }

    editModal.style.display = 'flex';
}

// Handle Edit Submit
document.getElementById('edit-form').addEventListener('submit', async (e) => {
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
            showToast('Transação atualizada!', 'success');
            editModal.style.display = 'none';
            updateStats();
            updateTransactions();
        } else {
            showToast('Erro ao atualizar.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Erro de conexão.', 'error');
    }
});


// Add New Type
document.getElementById('type-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.type_name.value;

    try {
        const res = await fetch(`${API_URL}/gold-types`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        if (res.ok) {
            showToast('Tipo adicionado!', 'success');
            modal.style.display = 'none';
            e.target.reset();
            fetchGoldTypes();
        } else {
            showToast('Erro ao salvar tipo.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Erro de conexão.', 'error');
    }
});


// Fetch and Update Dashboard Stats
async function updateStats() {
    try {
        const response = await fetch(`${API_URL}/inventory`);
        const data = await response.json();

        const container = document.getElementById('stats-container');
        container.innerHTML = ''; // Clear existing

        const types = Object.keys(data);
        if (types.length === 0) {
            container.innerHTML = '<div class="card"><div class="card-title">Estoque</div><div class="card-value">Vazio</div></div>';
            return;
        }

        types.forEach(type => {
            const info = data[type];
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-title" style="color: var(--accent-gold);">${type}</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-secondary);">Estoque:</span>
                    <span style="font-weight: 600; color: var(--text-primary);">${info.stock.toFixed(2)} g</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">
                    <div>Comp.: ${info.bought.toFixed(2)} g</div>
                    <div>Vend.: ${info.sold.toFixed(2)} g</div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Fetch and Update Transactions Table
async function updateTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions`);
        const transactions = await response.json();

        const tbody = document.getElementById('transactions-body');
        tbody.innerHTML = '';

        transactions.forEach(tx => {
            const tr = document.createElement('tr');
            const isBuy = tx.type === 'BUY';
            const typeBadge = isBuy
                ? '<span class="badge badge-buy">COMPRA</span>'
                : '<span class="badge badge-sell">VENDA</span>';

            const receiptHtml = tx.receipt_path
                ? `<a href="/${tx.receipt_path}" target="_blank" class="receipt-link">Ver</a>`
                : '-';

            const deliveryInfo = tx.delivery_courier
                ? `<div style="font-size: 0.85rem;">${tx.delivery_courier} (${formatCurrency(tx.delivery_cost)})</div>`
                : '-';

            // We attach the full tx object to the button dataset or pass via closure
            // Better to just pass id? No, we need object to populate form.
            // We can store tx in memory map or just re-fetch.
            // Let's attach JSON string to data attribute (simple but works for small data)
            const txData = encodeURIComponent(JSON.stringify(tx));

            tr.innerHTML = `
                <td>${formatDate(tx.date)}</td>
                <td>${typeBadge}</td>
                <td style="color: var(--accent-gold);">${tx.gold_type_name || 'N/A'}</td>
                <td>
                    <div>${tx.customer_name || '-'}</div>
                </td>
                <td style="font-weight: 600;">${tx.weight_grams.toFixed(2)} g</td>
                <td>${formatCurrency(tx.price)}</td>
                <td>${deliveryInfo}</td>
                <td>${receiptHtml}</td>
                <td>
                    <button class="btn-icon" onclick="openEditModal(JSON.parse(decodeURIComponent('${txData}')))">
                        <!-- Edit Icon SVG -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

function getWeightInGrams(form) {
    const val = parseFloat(form.weight.value);
    const unit = form.unit.value;
    return unit === 'kg' ? val * 1000 : val;
}

// Handle Purchase Form Submit
document.getElementById('buy-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Convert to grams
    const weightGrams = getWeightInGrams(e.target);

    const payload = new FormData();
    payload.append('gold_type_id', formData.get('gold_type'));
    payload.append('weight_grams', weightGrams);
    payload.append('price', formData.get('price'));
    payload.append('customer_name', formData.get('customer'));

    if (formData.get('receipt').size > 0) {
        payload.append('receipt', formData.get('receipt'));
    }

    try {
        const res = await fetch(`${API_URL}/buy`, {
            method: 'POST',
            body: payload
        });

        if (res.ok) {
            showToast('Compra registrada com sucesso!', 'success');
            e.target.reset();
            updateStats();
            updateTransactions();
        } else {
            const err = await res.json();
            showToast('Erro: ' + err.error, 'error');
        }
    } catch (error) {
        console.error('Error submitting buy form:', error);
        showToast('Erro de conexão.', 'error');
    }
});

// Handle Sale Form Submit
document.getElementById('sell-form').addEventListener('submit', async (e) => {
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
    }

    if (formData.get('receipt').size > 0) {
        payload.append('receipt', formData.get('receipt'));
    }

    try {
        const res = await fetch(`${API_URL}/sell`, {
            method: 'POST',
            body: payload
        });

        if (res.ok) {
            showToast('Venda registrada com sucesso!', 'success');
            e.target.reset(); // Resets everything including hidden delivery fields
            document.querySelector('input[name="date"]').valueAsDate = new Date();
            document.getElementById('delivery-fields').style.display = 'none';
            updateStats();
            updateTransactions();
        } else {
            const err = await res.json();
            showToast('Erro: ' + err.error, 'error');
        }
    } catch (error) {
        console.error('Error submitting sell form:', error);
        showToast('Erro de conexão.', 'error');
    }
});

// Initial Load
fetchGoldTypes();
updateStats();
updateTransactions();
