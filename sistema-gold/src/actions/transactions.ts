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

    const weight = parseFloat(formData.get('weight') as string)
    const price = parseFloat(formData.get('price') as string)
    const goldTypeId = Number(formData.get('gold_type_id'))
    const pointId = Number(formData.get('point_id'))
    const customer = formData.get('customer') as string
    const file = formData.get('receipt') as File
    const unit = formData.get('unit') as string || 'g'

    if (!weight || !price || !goldTypeId || !pointId) {
        return { error: 'Preencha os campos obrigatórios.' }
    }

    try {
        const receiptPath = await saveFile(file)
        const date = new Date().toISOString()

        const stmt = db.prepare(`
        INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id, user_id, unit) 
        VALUES ('BUY', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
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

    const weight = parseFloat(formData.get('weight') as string)
    const price = parseFloat(formData.get('price') as string)
    const goldTypeId = Number(formData.get('gold_type_id'))
    const pointId = Number(formData.get('point_id'))
    const customer = formData.get('customer') as string
    const unit = formData.get('unit') as string || 'g'

    // Delivery fields
    const deliveryCourier = formData.get('delivery_courier') as string
    const deliveryCost = parseFloat(formData.get('delivery_cost') as string) || 0

    const file = formData.get('receipt') as File

    if (!weight || !price || !goldTypeId || !pointId) {
        return { error: 'Preencha os campos obrigatórios.' }
    }

    try {
        const receiptPath = await saveFile(file)
        const date = new Date().toISOString()

        const stmt = db.prepare(`
        INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id, user_id, unit, delivery_courier, delivery_cost) 
        VALUES ('SELL', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
        stmt.run(weight, price, customer, receiptPath, date, goldTypeId, pointId, userId, unit, deliveryCourier, deliveryCost)

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
    // Group by Point -> Gold Type -> Unit
    const txs = db.prepare(`
        SELECT t.type, t.weight_grams, t.unit, gt.name as gold_name, p.name as point_name 
        FROM transactions t
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        LEFT JOIN points p ON t.point_id = p.id
        WHERE t.user_id = ?
    `).all(userId) as any[]

    const inventory: any = {}

    txs.forEach(tx => {
        const point = tx.point_name || 'Geral'
        const gold = tx.gold_name || 'Desconhecido'
        const unit = tx.unit || 'g'
        const key = `${point}-${gold}-${unit}`

        if (!inventory[key]) {
            inventory[key] = {
                point,
                gold,
                unit,
                stock: 0
            }
        }

        if (tx.type === 'BUY') inventory[key].stock += tx.weight_grams
        if (tx.type === 'SELL') inventory[key].stock -= tx.weight_grams
    })

    return Object.values(inventory).filter((i: any) => i.stock !== 0)
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
