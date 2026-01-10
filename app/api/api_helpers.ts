
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function throwError(error: unknown) {
    if (error instanceof Error) {
        throw new Error(error.message);

    }

    if (typeof error === "string") {
        throw new Error(error);
    }

    throw new Error("An unknown error occurred!");
}

export function generateTokens(userId: string, userRole: string) {
    const accessToken = jwt.sign({ userId, userRole }, process.env.JWT_SECRET_KEY!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId, userRole }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}

import { cookies } from 'next/headers';

export async function setRefreshTokenCookie(refreshToken: string) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'refresh',
        value: refreshToken,
        httpOnly: true,
        secure: true,
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60, // 7 días
        sameSite: 'strict',
    });
}

export async function setRoleAndSessionCookie(userRole: string) {
    const cookieStore = await cookies();
    const ACCESS_TTL = 60 * 60 * 24 * 7;
    cookieStore.set({
        name: 'session',
        value: '1',
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: ACCESS_TTL,
        sameSite: 'strict',
    });

    cookieStore.set({
        name: 'role',
        value: userRole,
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: ACCESS_TTL + 30,
        sameSite: 'strict',
    });
}

export async function deleteRoleAndSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    cookieStore.delete('role');
}


export function handleError(
    error: unknown,
    context?: string,
    status = 500
) {
    if (context) console.error(`Error from: ${context}`);
    console.error(error);

    if (error instanceof Error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status }
        );
    }

    if (typeof error === 'string') {
        return NextResponse.json(
            {
                success: false,
                error,
            },
            { status }
        );
    }

    return NextResponse.json(
        {
            success: false,
            error: 'Internal server error',
        },
        { status }
    );
}

