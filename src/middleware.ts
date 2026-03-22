import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    const { pathname } = request.nextUrl

    const isPublicPath = pathname === '/auth/login' || pathname === '/auth/register'

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
}