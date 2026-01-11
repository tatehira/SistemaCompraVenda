'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getPoints() {
    return db.prepare('SELECT * FROM points').all()
}

export async function addPoint(name: string, address: string, userId: number) {
    if (!name) return { error: 'Nome é obrigatório.' }
    try {
        db.prepare('INSERT INTO points (name, address, user_id) VALUES (?, ?, ?)').run(name, address, userId)
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deletePoint(id: number) {
    try {
        db.prepare('DELETE FROM points WHERE id = ?').run(id)
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
