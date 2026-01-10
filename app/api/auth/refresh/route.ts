
import jwt from "jsonwebtoken";
import * as UserServices from "@/app/api/services/user.service";
import { generateTokens, handleError, setRefreshTokenCookie, setRoleAndSessionCookie } from "@/app/api/api_helpers";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshTokenFromCookie = cookieStore.get('refresh')?.value;
        if (!refreshTokenFromCookie) {
            return NextResponse.json({ success: false, error: "No refresh token found" }, { status: 401 });
        }

        // Validar firma del refresh token
        const decoded = jwt.verify(refreshTokenFromCookie, REFRESH_SECRET) as { userId: string, userRole: string };

        // Verificar que el token esté en DB (no revocado / no roto)
        const isValid = await UserServices.validateRefreshToken(decoded.userId, refreshTokenFromCookie);
        if (!isValid) {
            return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 403 });
        }
        // Crear nuevo Access Token
        const { accessToken } = generateTokens(decoded.userId, decoded.userRole);

        const user = await UserServices.findById(decoded.userId);

        await setRoleAndSessionCookie(decoded.userRole);

        return NextResponse.json({
            success: true,
            accessToken,
            accessTokenExpiresIn: "30m",
            user
        });
    } catch (error: any) {
        if (error?.name === "TokenExpiredError") {
            return NextResponse.json({ success: false, error: "Refresh token expired, please login again" }, { status: 403 });
        }
        return handleError(error, "refresh endpoint");
    }
}
