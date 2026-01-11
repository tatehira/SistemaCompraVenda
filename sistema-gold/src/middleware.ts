import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode('my-secret-key-change-this-in-prod')

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            await jwtVerify(session, SECRET_KEY, { algorithms: ['HS256'] })
        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login') {
        if (session) {
            try {
                await jwtVerify(session, SECRET_KEY, { algorithms: ['HS256'] })
                return NextResponse.redirect(new URL('/dashboard', request.url))
            } catch (e) {
                // if invalid, let them stay on login
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
