module.exports = [
"[project]/src/actions/gold.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00d21a24f5b59e38c72ac9d9dabd34fe7beacb3fca":"getGoldTypes","00e148d512a9f0c88de30b87a04e918b1e1a8c36c6":"getUnits","409264ad8a969cb16f0f5f603f3e617c832129ee2a":"deleteGoldType","6052195bed8ff9f808f48a6d14d8bc829aad71a675":"addGoldType","70d5a5be56884eeb232f17c63c8b28382dc4d435f2":"addUnit"},"",""] */ __turbopack_context__.s([
    "addGoldType",
    ()=>addGoldType,
    "addUnit",
    ()=>addUnit,
    "deleteGoldType",
    ()=>deleteGoldType,
    "getGoldTypes",
    ()=>getGoldTypes,
    "getUnits",
    ()=>getUnits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getGoldTypes() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('SELECT * FROM gold_types').all();
}
async function addGoldType(name, userId) {
    if (!name) return {
        error: 'Nome é obrigatório.'
    };
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('INSERT INTO gold_types (name, user_id) VALUES (?, ?)').run(name, userId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/settings');
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
async function deleteGoldType(id) {
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('DELETE FROM gold_types WHERE id = ?').run(id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/settings');
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
async function getUnits() {
    // Return standard units
    return [
        {
            id: 'g',
            symbol: 'g',
            name: 'Grama'
        },
        {
            id: 'kg',
            symbol: 'kg',
            name: 'Quilo'
        }
    ];
}
async function addUnit(name, symbol, userId) {
    // Deprecated / No-op
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getGoldTypes,
    addGoldType,
    deleteGoldType,
    getUnits,
    addUnit
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getGoldTypes, "00d21a24f5b59e38c72ac9d9dabd34fe7beacb3fca", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addGoldType, "6052195bed8ff9f808f48a6d14d8bc829aad71a675", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteGoldType, "409264ad8a969cb16f0f5f603f3e617c832129ee2a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUnits, "00e148d512a9f0c88de30b87a04e918b1e1a8c36c6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addUnit, "70d5a5be56884eeb232f17c63c8b28382dc4d435f2", null);
}),
"[project]/src/actions/points.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0020fce195b8defcb4651b1d7d264e54f6addfaf7a":"getPoints","401509319cfa658d001112a73990c2beee117875a6":"deletePoint","70e37246521062bf64cd03fcbb55927e68d312ba23":"addPoint"},"",""] */ __turbopack_context__.s([
    "addPoint",
    ()=>addPoint,
    "deletePoint",
    ()=>deletePoint,
    "getPoints",
    ()=>getPoints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getPoints() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('SELECT * FROM points').all();
}
async function addPoint(name, address, userId) {
    if (!name) return {
        error: 'Nome é obrigatório.'
    };
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('INSERT INTO points (name, address, user_id) VALUES (?, ?, ?)').run(name, address, userId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/settings');
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
async function deletePoint(id) {
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('DELETE FROM points WHERE id = ?').run(id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/settings');
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getPoints,
    addPoint,
    deletePoint
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPoints, "0020fce195b8defcb4651b1d7d264e54f6addfaf7a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addPoint, "70e37246521062bf64cd03fcbb55927e68d312ba23", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deletePoint, "401509319cfa658d001112a73990c2beee117875a6", null);
}),
"[project]/src/actions/couriers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00afe604ffd025a8ab47f48bdaafdda00aa3a623b4":"getCouriers","40dbfbf9671d93557d3665f79e41e8a5669c8a29a9":"deleteCourier","7850284344ffca868449544ec5c1e2a3df3a4797e3":"addCourier"},"",""] */ __turbopack_context__.s([
    "addCourier",
    ()=>addCourier,
    "deleteCourier",
    ()=>deleteCourier,
    "getCouriers",
    ()=>getCouriers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getCouriers() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('SELECT * FROM couriers').all();
}
async function addCourier(name, phone, defaultFee, userId) {
    if (!name) return {
        error: 'Nome é obrigatório.'
    };
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('INSERT INTO couriers (name, phone, default_fee, user_id) VALUES (?, ?, ?, ?)').run(name, phone, defaultFee, userId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/settings');
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
async function deleteCourier(id) {
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('DELETE FROM couriers WHERE id = ?').run(id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/settings');
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCouriers,
    addCourier,
    deleteCourier
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCouriers, "00afe604ffd025a8ab47f48bdaafdda00aa3a623b4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addCourier, "7850284344ffca868449544ec5c1e2a3df3a4797e3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCourier, "40dbfbf9671d93557d3665f79e41e8a5669c8a29a9", null);
}),
"[project]/.next-internal/server/app/dashboard/settings/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/gold.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/points.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/actions/couriers.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$gold$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/gold.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$points$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/points.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$couriers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/couriers.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/settings/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/gold.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/points.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/actions/couriers.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0002959933141a8591005362d9782db40d573d8cf8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"],
    "0020fce195b8defcb4651b1d7d264e54f6addfaf7a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$points$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPoints"],
    "00a1b9d856be879042d75ff8dc8dfb1962524258ed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "00afe604ffd025a8ab47f48bdaafdda00aa3a623b4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$couriers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCouriers"],
    "00d21a24f5b59e38c72ac9d9dabd34fe7beacb3fca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$gold$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGoldTypes"],
    "00e148d512a9f0c88de30b87a04e918b1e1a8c36c6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$gold$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUnits"],
    "401509319cfa658d001112a73990c2beee117875a6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$points$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deletePoint"],
    "409264ad8a969cb16f0f5f603f3e617c832129ee2a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$gold$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteGoldType"],
    "40dbfbf9671d93557d3665f79e41e8a5669c8a29a9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$couriers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCourier"],
    "40e0bd842711d0001166ef627af8cdd4fdfd29a8c8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["register"],
    "40e3529cc11f2a04b1381f754a6a7c944ce0f2ce39",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["login"],
    "6052195bed8ff9f808f48a6d14d8bc829aad71a675",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$gold$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addGoldType"],
    "70d5a5be56884eeb232f17c63c8b28382dc4d435f2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$gold$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addUnit"],
    "70e37246521062bf64cd03fcbb55927e68d312ba23",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$points$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addPoint"],
    "7850284344ffca868449544ec5c1e2a3df3a4797e3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$couriers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addCourier"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$settings$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$gold$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$points$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$couriers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/settings/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/gold.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/actions/points.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/actions/couriers.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$gold$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/gold.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$points$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/points.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$couriers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/couriers.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_2374b8ca._.js.map