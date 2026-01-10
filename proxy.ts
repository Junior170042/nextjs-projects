import { NextRequest, NextResponse } from 'next/server';
import { checkUserLevel, isRoleAllowed } from './lib/utils';
import { UserRole } from './app/types';
export async function proxy(req: NextRequest) {
    try {
        const session = req.cookies.get('session')?.value
        if (!session || session === "") {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        const currentPath = req.nextUrl.pathname;

        if (session && currentPath === "/login") {
            return NextResponse.redirect(new URL('/', req.url));
        }

        const userRole = req.cookies.get('role')?.value as keyof typeof UserRole;

        if (!checkUserLevel({ CurrentRole: userRole, AllowedRoles: [UserRole.ADMIN] })) {
            if (!isRoleAllowed({ role: userRole, path: currentPath })) {
                return NextResponse.redirect(new URL('/forbidden', req.url))
            }
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/forbidden', req.url))
    }
}

export const config = {
    //all routes
    matcher: ['/:path*'],
};
