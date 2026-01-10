import { NextResponse } from 'next/server';
import { generateTokens, handleError, setRefreshTokenCookie, setRoleAndSessionCookie } from '../../api_helpers';
import { isEmail } from '@/app/utils/validator';
import * as UserServices from '@/app/api/services/user.service';
import { User } from '@/app/types';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, code } = body;

        if (!isEmail(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address!' },
                { status: 401 }
            );
        }

        if (!code) {
            return NextResponse.json(
                { success: false, error: 'The verification code is required!' },
                { status: 400 }
            );
        }

        const user = await UserServices.login(email, code);

        if (!user || !user.id) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 🔐 Generar tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.userRole);

        // 💾 Guardar refresh token
        await UserServices.saveRefreshToken(user.id, refreshToken);

        // 🍪 Setear cookie HttpOnly
        await setRefreshTokenCookie(refreshToken);
        await setRoleAndSessionCookie(user.userRole);

        // ✅ Response final
        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    authProvider: user.authProvider,
                    userRole: user.userRole,
                } as User,
                accessToken,
                accessTokenExpiresIn: '30m',
            },
        });
    } catch (error: unknown) {
        return handleError(error, "user login");
    }
}
