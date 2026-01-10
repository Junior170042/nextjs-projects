"use client";
import { createContext, useContext, useState, useEffect, useTransition } from "react";
import type { LoginResponse, User } from "../types";
import { LoadingPrincipal } from "../components/loadings/loading_principal";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
    accessToken: string | null;
    isRefreshing: boolean;
    accessTokenExpiresIn: string | null;
    login: (data: LoginResponse) => void;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [accessTokenExpiresIn, setAccessTokenExpiresIn] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const login = (data: LoginResponse) => {
        setAccessToken(data.accessToken);
        setAccessTokenExpiresIn(data.accessTokenExpiresIn);
        setUser(data.user);
        router.push('/');
    };

    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        setAccessToken(null);
        setUser(null);
    };

    const refresh = async () => {

        startTransition(async () => {
            const res = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include"
            });

            if (!res.ok || res.status !== 200) {
                await logout();
                return;
            };

            const data = await res.json();
            setAccessToken(data.accessToken);
            setUser(data.user);
        });
    };

    useEffect(() => {
        async function checkRefreshToken() {
            await refresh();
        }
        checkRefreshToken();
    }, []);

    const value = {
        user,
        accessToken,
        accessTokenExpiresIn,
        isRefreshing: isPending,
        login,
        logout,
        refresh
    };

    return (
        <AuthContext.Provider value={value}>
            {isPending ? <LoadingPrincipal /> : children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)!;






