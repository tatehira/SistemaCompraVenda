'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getCouriers() {
    return db.prepare('SELECT * FROM couriers').all()
}

export async function addCourier(name: string, phone: string, defaultFee: number, userId: number) {
    if (!name) return { error: 'Nome é obrigatório.' }
    try {
        db.prepare('INSERT INTO couriers (name, phone, default_fee, user_id) VALUES (?, ?, ?, ?)').run(name, phone, defaultFee, userId)
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteCourier(id: number) {
    try {
        db.prepare('DELETE FROM couriers WHERE id = ?').run(id)
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
