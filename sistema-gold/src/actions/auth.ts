'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'
import database from '@/lib/db'
import { revalidatePath } from 'next/cache'

const SECRET_KEY = new TextEncoder().encode('my-secret-key-change-this-in-prod')

export async function login(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string // In prod, hash check!

    if (!username || !password) {
        return { error: 'Preencha todos os campos.' }
    }

    const user = database.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password) as any

    if (!user) {
        return { error: 'Credenciais inválidas.' }
    }

    // Create Session
    const token = await new SignJWT({ sub: user.id.toString(), role: user.role, username: user.username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(SECRET_KEY)

    const cookieStore = await cookies()
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    })

    redirect('/dashboard')
}

export async function register(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
        return { error: 'Preencha todos os campos.' }
    }

    try {
        const existing = database.prepare('SELECT * FROM users WHERE username = ?').get(username)
        if (existing) {
            return { error: 'Usuário já existe.' }
        }

        const result = database.prepare(
            "INSERT INTO users (username, password, role, preferred_unit) VALUES (?, ?, 'admin', 'g')"
        ).run(username, password)

        // Auto login
        const token = await new SignJWT({ sub: result.lastInsertRowid.toString(), role: 'admin', username })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(SECRET_KEY)

        const cookieStore = await cookies()
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })

    } catch (err: any) {
        return { error: err.message || 'Erro ao criar conta.' }
    }

    redirect('/dashboard')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/login')
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null

    try {
        const { payload } = await jwtVerify(session, SECRET_KEY, { algorithms: ['HS256'] })
        return payload
    } catch (error) {
        return null
    }
}
