'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getSession } from './auth'

// Helper to save file
async function saveFile(file: File | null) {
    if (!file || file.size === 0) return null

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)
    return `/uploads/${filename}`
}

export async function buy(formData: FormData) {
    const session = await getSession()
    if (!session) return { error: 'Não autorizado' }
    const userId = Number(session.sub)

    let weight = parseFloat(formData.get('weight') as string)
    const price = parseFloat(formData.get('price') as string)
    const goldTypeId = Number(formData.get('gold_type_id'))
    const pointId = Number(formData.get('point_id'))
    const customer = formData.get('customer') as string
    const file = formData.get('receipt') as File
    const unit = formData.get('unit') as string || 'g'

    if (!weight || !price || !goldTypeId || !pointId) {
        return { error: 'Preencha os campos obrigatórios.' }
    }

    // NORMALIZE TO GRAMS
    if (unit === 'kg') {
        weight = weight * 1000
    }

    try {
        const receiptPath = await saveFile(file)
        const date = new Date().toISOString()

        const stmt = db.prepare(`
        INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id, user_id, unit) 
        VALUES ('BUY', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
        // We store 'weight' (grams) but keep 'unit' as the ORIGINAL input unit for reference if needed, 
        // OR we standardize 'unit' to 'g' in DB? 
        // User wants "Entrou 100kg". If we store 'g', we lose that it was input as kg.
        // Let's store the NORMALIZED weight for math, but maybe we can store the unit context?
        // Actually, "Unit" column in DB was used for grouping. 
        // Better strategy: Store everything as 'g' in DB for consistency in grouping. 
        // The "Unit" column becomes less relevant for calculation, but maybe useful for "Original Input".
        // However, to make 100kg - 100g math work easily, we must group by GoldTypeId ONLY, not (GoldTypeId + Unit).
        // So we will force unit to 'g' in the DB or ignore it in grouping.

        stmt.run(weight, price, customer, receiptPath, date, goldTypeId, pointId, userId, unit)

        revalidatePath('/dashboard/inventory')
        revalidatePath('/dashboard/transactions')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function sell(formData: FormData) {
    const session = await getSession()
    if (!session) return { error: 'Não autorizado' }
    const userId = Number(session.sub)

    let weight = parseFloat(formData.get('weight') as string)
    const price = parseFloat(formData.get('price') as string)
    const goldTypeId = Number(formData.get('gold_type_id'))
    const pointId = Number(formData.get('point_id'))
    const customer = formData.get('customer') as string
    const unit = formData.get('unit') as string || 'g'

    // Delivery fields
    const deliveryCourierName = formData.get('delivery_courier') as string
    let deliveryCost = 0

    // If courier selected, fetch standard fee from DB
    if (deliveryCourierName) {
        const courier = db.prepare('SELECT fee FROM couriers WHERE name = ? AND user_id = ?').get(deliveryCourierName, userId) as any
        if (courier) {
            deliveryCost = courier.fee || 0
        }
    }

    const file = formData.get('receipt') as File

    if (!weight || !price || !goldTypeId || !pointId) {
        return { error: 'Preencha os campos obrigatórios.' }
    }

    // NORMALIZE TO GRAMS
    if (unit === 'kg') {
        weight = weight * 1000
    }

    try {
        const receiptPath = await saveFile(file)
        const date = new Date().toISOString()

        const stmt = db.prepare(`
        INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id, user_id, unit, delivery_courier, delivery_cost) 
        VALUES ('SELL', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
        stmt.run(weight, price, customer, receiptPath, date, goldTypeId, pointId, userId, unit, deliveryCourierName, deliveryCost)

        revalidatePath('/dashboard/inventory')
        revalidatePath('/dashboard/transactions')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getInventory() {
    const session = await getSession()
    if (!session) return []
    const userId = Number(session.sub)

    // Calculate inventory
    // Group by Point -> Gold Type ONLY (Ignore unit column for grouping, merge everything to grams)
    const txs = db.prepare(`
        SELECT t.type, t.weight_grams, gt.name as gold_name, p.name as point_name 
        FROM transactions t
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        LEFT JOIN points p ON t.point_id = p.id
        WHERE t.user_id = ?
    `).all(userId) as any[]

    const inventory: any = {}

    txs.forEach(tx => {
        const point = tx.point_name || 'Geral'
        const gold = tx.gold_name || 'Desconhecido'
        // Key is just Point + Gold. We aggregate ALL units here.
        const key = `${point}-${gold}`

        if (!inventory[key]) {
            inventory[key] = {
                point,
                gold,
                stock_grams: 0
            }
        }

        if (tx.type === 'BUY') inventory[key].stock_grams += tx.weight_grams
        if (tx.type === 'SELL') inventory[key].stock_grams -= tx.weight_grams
    })

    return Object.values(inventory).filter((i: any) => Math.abs(i.stock_grams) > 0.001)
}

export async function getTransactions() {
    const session = await getSession()
    if (!session) return []
    const userId = Number(session.sub)

    return db.prepare(`
        SELECT t.*, gt.name as gold_name, p.name as point_name
        FROM transactions t
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        LEFT JOIN points p ON t.point_id = p.id
        WHERE t.user_id = ?
        ORDER BY date DESC
    `).all(userId)
}

export async function getDailySales() {
    const session = await getSession()
    if (!session) return []
    const userId = Number(session.sub)

    // SQLite: strftime('%Y-%m-%d', date) extracts the date part
    // We get last 30 days of sales
    return db.prepare(`
        SELECT strftime('%Y-%m-%d', date) as date, SUM(price) as total
        FROM transactions
        WHERE type = 'SELL' AND user_id = ?
        GROUP BY date
        ORDER BY date ASC
        LIMIT 30
    `).all(userId)
}
