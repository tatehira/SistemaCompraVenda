'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

// --- Gold Types ---
export async function getGoldTypes() {
    return db.prepare('SELECT * FROM gold_types').all()
}

export async function addGoldType(name: string, userId: number) {
    if (!name) return { error: 'Nome é obrigatório.' }
    try {
        db.prepare('INSERT INTO gold_types (name, user_id) VALUES (?, ?)').run(name, userId)
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteGoldType(id: number) {
    try {
        db.prepare('DELETE FROM gold_types WHERE id = ?').run(id)
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

// --- Measure Units ---
export async function getUnits() {
    return db.prepare('SELECT * FROM measure_units').all()
}

export async function addUnit(name: string, symbol: string, userId: number) {
    if (!name || !symbol) return { error: 'Nome e símbolo são obrigatórios.' }
    try {
        db.prepare('INSERT INTO measure_units (name, symbol, user_id) VALUES (?, ?, ?)').run(name, symbol, userId)
        revalidatePath('/dashboard/settings')
        revalidatePath('/dashboard/buy') // Used in buy
        revalidatePath('/dashboard/sell') // Used in sell
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
