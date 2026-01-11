import { NextRequest, NextResponse } from 'next/server';
import { checkUserLevel, isRoleAllowed } from './lib/utils';
import { UserRole } from './app/types';

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Skip middleware for static files, images, and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // matches favicon.ico, images, etc.
    ) {
        return NextResponse.next();
    }

    const session = req.cookies.get('session')?.value;

    // 2. Avoid infinite loop: If no session and NOT on /login, redirect to /login
    if (!session || session === "") {
        if (pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.next();
    }

    // 3. If session exists and user is on /login, redirect to home
    if (session && pathname === "/login") {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // 4. Role-based access control
    try {
        const userRole = req.cookies.get('role')?.value as keyof typeof UserRole;

        if (userRole) {
            // Admin has access to everything
            if (checkUserLevel({ CurrentRole: userRole, AllowedRoles: [UserRole.ADMIN] })) {
                return NextResponse.next();
            }

            // Check if user role is allowed for specific path
            if (!isRoleAllowed({ role: userRole, path: pathname })) {
                return NextResponse.redirect(new URL('/forbidden', req.url));
            }
        }
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.redirect(new URL('/forbidden', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
