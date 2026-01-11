module.exports = [
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[project]/src/actions/transactions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"008f922624bec3cd7d7127a70dee5cb7eb09f87f14":"getInventory","00dee16e6190adbdc458be42dc5a61a99dbfa86c29":"getTransactions","403b338f71653513c62afda809781b1cd68b6a1ec6":"buy","40d49c43eff74a425b8d9d5146453d76bb766db371":"sell"},"",""] */ __turbopack_context__.s([
    "buy",
    ()=>buy,
    "getInventory",
    ()=>getInventory,
    "getTransactions",
    ()=>getTransactions,
    "sell",
    ()=>sell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
// Helper to save file
async function saveFile(file) {
    if (!file || file.size === 0) return null;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'uploads');
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["mkdir"])(uploadDir, {
        recursive: true
    });
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filepath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(uploadDir, filename);
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(filepath, buffer);
    return `/uploads/${filename}`;
}
async function buy(formData) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) return {
        error: 'Não autorizado'
    };
    const userId = Number(session.sub);
    const weight = parseFloat(formData.get('weight'));
    const price = parseFloat(formData.get('price'));
    const goldTypeId = Number(formData.get('gold_type_id'));
    const pointId = Number(formData.get('point_id'));
    const customer = formData.get('customer');
    const file = formData.get('receipt');
    const unit = formData.get('unit') || 'g';
    if (!weight || !price || !goldTypeId || !pointId) {
        return {
            error: 'Preencha os campos obrigatórios.'
        };
    }
    try {
        const receiptPath = await saveFile(file);
        const date = new Date().toISOString();
        const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare(`
        INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id, user_id, unit) 
        VALUES ('BUY', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(weight, price, customer, receiptPath, date, goldTypeId, pointId, userId, unit);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/inventory');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/transactions');
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
async function sell(formData) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) return {
        error: 'Não autorizado'
    };
    const userId = Number(session.sub);
    const weight = parseFloat(formData.get('weight'));
    const price = parseFloat(formData.get('price'));
    const goldTypeId = Number(formData.get('gold_type_id'));
    const pointId = Number(formData.get('point_id'));
    const customer = formData.get('customer');
    const unit = formData.get('unit') || 'g';
    // Delivery fields
    const deliveryCourier = formData.get('delivery_courier');
    const deliveryCost = parseFloat(formData.get('delivery_cost')) || 0;
    const file = formData.get('receipt');
    if (!weight || !price || !goldTypeId || !pointId) {
        return {
            error: 'Preencha os campos obrigatórios.'
        };
    }
    try {
        const receiptPath = await saveFile(file);
        const date = new Date().toISOString();
        const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare(`
        INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id, user_id, unit, delivery_courier, delivery_cost) 
        VALUES ('SELL', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(weight, price, customer, receiptPath, date, goldTypeId, pointId, userId, unit, deliveryCourier, deliveryCost);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/inventory');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/transactions');
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
async function getInventory() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) return [];
    const userId = Number(session.sub);
    // Calculate inventory
    // Group by Point -> Gold Type -> Unit
    const txs = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare(`
        SELECT t.type, t.weight_grams, t.unit, gt.name as gold_name, p.name as point_name 
        FROM transactions t
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        LEFT JOIN points p ON t.point_id = p.id
        WHERE t.user_id = ?
    `).all(userId);
    const inventory = {};
    txs.forEach((tx)=>{
        const point = tx.point_name || 'Geral';
        const gold = tx.gold_name || 'Desconhecido';
        const unit = tx.unit || 'g';
        const key = `${point}-${gold}-${unit}`;
        if (!inventory[key]) {
            inventory[key] = {
                point,
                gold,
                unit,
                stock: 0
            };
        }
        if (tx.type === 'BUY') inventory[key].stock += tx.weight_grams;
        if (tx.type === 'SELL') inventory[key].stock -= tx.weight_grams;
    });
    return Object.values(inventory).filter((i)=>i.stock !== 0);
}
async function getTransactions() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) return [];
    const userId = Number(session.sub);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare(`
        SELECT t.*, gt.name as gold_name, p.name as point_name
        FROM transactions t
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        LEFT JOIN points p ON t.point_id = p.id
        WHERE t.user_id = ?
        ORDER BY date DESC
    `).all(userId);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    buy,
    sell,
    getInventory,
    getTransactions
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(buy, "403b338f71653513c62afda809781b1cd68b6a1ec6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sell, "40d49c43eff74a425b8d9d5146453d76bb766db371", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getInventory, "008f922624bec3cd7d7127a70dee5cb7eb09f87f14", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTransactions, "00dee16e6190adbdc458be42dc5a61a99dbfa86c29", null);
}),
"[project]/.next-internal/server/app/dashboard/inventory/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/transactions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$transactions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/transactions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/inventory/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/transactions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0002959933141a8591005362d9782db40d573d8cf8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"],
    "008f922624bec3cd7d7127a70dee5cb7eb09f87f14",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$transactions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getInventory"],
    "00a1b9d856be879042d75ff8dc8dfb1962524258ed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "00dee16e6190adbdc458be42dc5a61a99dbfa86c29",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$transactions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTransactions"],
    "403b338f71653513c62afda809781b1cd68b6a1ec6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$transactions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buy"],
    "40d49c43eff74a425b8d9d5146453d76bb766db371",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$transactions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sell"],
    "40e0bd842711d0001166ef627af8cdd4fdfd29a8c8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["register"],
    "40e3529cc11f2a04b1381f754a6a7c944ce0f2ce39",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["login"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$transactions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/inventory/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/transactions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$transactions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/transactions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4042bd25._.js.map