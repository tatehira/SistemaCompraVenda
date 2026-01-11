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

// --- Units (Static for now) ---
export async function getUnits() {
    // Return standard units
    return [
        { id: 'g', symbol: 'g', name: 'Grama' },
        { id: 'kg', symbol: 'kg', name: 'Quilo' }
    ]
}

export async function addUnit(name: string, symbol: string, userId: number) {
    // Deprecated / No-op
    return { success: true }
}
