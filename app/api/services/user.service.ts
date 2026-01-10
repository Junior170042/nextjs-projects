import { throwError } from "../api_helpers";
import bcrypt from "bcrypt";
import { userSchema } from "../db/schema";
import jwt from "jsonwebtoken";
import { hasTimePassed } from "@/app/components/lib/utils";
export async function verifyUser(email: string) {
    try {
        const user = await userSchema().verifyUser(email);
        return user;
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function setNewUser(email: string, verificationToken: string) {
    try {
        await userSchema().setNewUser(email, verificationToken);
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function saveRefreshToken(userId: string, refreshToken: string) {
    try {

        const hashToken = await bcrypt.hash(refreshToken, 10);
        await userSchema().addRefreshToken(userId, hashToken);
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function validateRefreshToken(userId: string, refreshToken: string) {
    try {
        const user = await userSchema().findById(userId);
        if (!user || !user.refreshToken) {
            return false;
        }
        const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        return isTokenValid;
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function updateVerificationToken(email: string, verificationToken: string) {
    try {
        await userSchema().setVerificationToken(email, verificationToken);
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function removeRefreshToken(userId: string) {
    try {
        await userSchema().removeRefreshToken(userId);
    } catch (error: unknown) {
        throwError(error);
    }
}


export async function login(email: string, verificationCode: string) {
    try {

        if (!verificationCode || verificationCode === "") {
            throw new Error("Invalid code!");
        }

        const user = await userSchema().findByEmail(email);
        if (!user) {
            throw new Error("User is not found!");
        }

        if (!user.verificationToken) {
            throw new Error("Verification token is not found!");
        }

        const { code, expireAt } = jwt.verify(user.verificationToken, process.env.JWT_VERIFY_SECRET!) as { code: string, expireAt: number };

        if (hasTimePassed(expireAt, { minutes: 30 })) {
            throw new Error("Code expired!");
        }

        if (Number(code) !== Number(verificationCode)) {
            throw new Error("Invalid code!");
        }

        await userSchema().removeVerificationToken(email);

        return {
            id: user.id,
            email: user.email,
            name: user.name ?? "",
            picture: user.picture ?? "",
            authProvider: "email",
            userRole: user.userRole ?? "user",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Invalid code or code expired!");
        }
        throw error.message;
    }
}

export async function findById(id: string) {
    try {
        const user = await userSchema().findById(id);
        const userWithOutPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            authProvider: user.authProvider,
            userRole: user.userRole,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
        return userWithOutPassword ?? null;
    } catch (error: unknown) {
        throwError(error);
    }
}