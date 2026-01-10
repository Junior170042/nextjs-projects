
export interface Post {
    id: number;
    title: string;
    author: {
        name: string;
    };
    created_at: Date | string;
}
export type User = {
    id: string;
    name: string;
    email: string;
    authProvider: string;
    picture: string | null;
    userRole: string;
}
export type LoginResponse = {
    user: User;
    accessToken: string;
    accessTokenExpiresIn: string;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    error?: string;
    data?: T;
}

export type Role = UserRole.USER | UserRole.ADMIN;

export type ValidateLoginResult = {
    isValid: boolean;
    errors: {
        email?: string;
        password?: string;
        name?: string;
        confirmPassword?: string;
    };
}

