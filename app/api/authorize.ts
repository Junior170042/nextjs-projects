import { NextRequest } from 'next/server';
import { Role, UserRole } from '../types';
import { getErrorMessage } from '../components/lib/utils';
import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export async function requireRole(
    req: NextRequest,
    roles: Role[]
) {
    try {
        const accessToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!accessToken) {
            return { error: "Unauthorized" }
        }

        const { userId, userRole } = jwt.verify(accessToken, JWT_SECRET_KEY!) as { userId: string, userRole: string };

        if (!userId || !userRole || userId === "" || userRole === "") {
            return { error: "Unauthorized" }
        }

        const currentRole = UserRole[(userRole.toUpperCase() as keyof typeof UserRole)]


        if (!roles.includes(currentRole)) {
            return { error: "Unauthorized" }
        }

        return { userId, userRole }

    } catch (error: unknown) {
        return { error: getErrorMessage(error, "Verifying role") }
    }
}
