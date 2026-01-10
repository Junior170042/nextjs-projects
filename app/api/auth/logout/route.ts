import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import * as UserServices from '@/app/api/services/user.service';
import { deleteRoleAndSessionCookie, handleError } from '../../api_helpers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh')?.value;

        cookieStore.set({
            name: 'refresh',
            value: '',
            httpOnly: true,
            secure: true,
            path: '/api/auth/refresh',
            maxAge: 0,
            sameSite: 'strict',
        });

        await deleteRoleAndSessionCookie();

        if (!refreshToken) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        let userId: string | undefined;

        try {
            const payload = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET!
            ) as { userId: string };

            userId = payload.userId;
        } catch {
            return NextResponse.json({ success: true });
        }

        if (!userId) {
            return NextResponse.json({ success: true });
        }

        // 💾 Invalidar refresh token en DB
        await UserServices.removeRefreshToken(userId);

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error, "logout");
    }
}
