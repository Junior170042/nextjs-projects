import { NextRequest, NextResponse } from 'next/server';
import { checkUserLevel, isPublicRoute, isRoleAllowed } from './lib/utils';
import { UserRole } from './app/types';

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const session = req.cookies.get('session')?.value;

    // 2. Avoid infinite loop: If no session and NOT on /login, redirect to /login
    if ((!session || session === "") && !isPublicRoute(pathname)) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (session && pathname === "/login") {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!isPublicRoute(pathname)) {
        const userRole = req.cookies.get('role')?.value as keyof typeof UserRole;

        if (!userRole) {
            return NextResponse.redirect(new URL('/forbidden', req.url));
        }

        // Check if user role is allowed for specific path
        if (!checkUserLevel({ CurrentRole: userRole, AllowedRoles: [UserRole.ADMIN] }) && !isRoleAllowed({ role: userRole, path: pathname })) {
            return NextResponse.redirect(new URL('/forbidden', req.url));
        }
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
