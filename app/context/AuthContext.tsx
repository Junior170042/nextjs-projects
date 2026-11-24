"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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
    refresh: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [accessTokenExpiresIn, setAccessTokenExpiresIn] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const refreshPromise = useRef<Promise<string | null> | null>(null);
    const router = useRouter();
    const login = useCallback((data: LoginResponse) => {
        setAccessToken(data.accessToken);
        setAccessTokenExpiresIn(data.accessTokenExpiresIn);
        setUser(data.user);
        router.push('/');
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } finally {
            setAccessToken(null);
            setAccessTokenExpiresIn(null);
            setUser(null);
        }
    }, []);

    const refresh = useCallback((): Promise<string | null> => {
        if (refreshPromise.current) return refreshPromise.current;

        const pendingRefresh = (async () => {
            setIsRefreshing(true);
            try {
                const res = await fetch("/api/auth/refresh", {
                    method: "POST",
                    credentials: "include"
                });

                if (!res.ok) {
                    await logout();
                    return null;
                }

                const data = await res.json() as LoginResponse;
                setAccessToken(data.accessToken);
                setAccessTokenExpiresIn(data.accessTokenExpiresIn);
                setUser(data.user);
                return data.accessToken;
            } catch {
                await logout().catch(() => undefined);
                return null;
            } finally {
                setIsRefreshing(false);
                setIsInitialized(true);
                refreshPromise.current = null;
            }
        })();
        refreshPromise.current = pendingRefresh;
        return pendingRefresh;
    }, [logout]);

    useEffect(() => {
        async function checkRefreshToken() {
            await refresh();
        }
        checkRefreshToken();
    }, [refresh]);

    const value = {
        user,
        accessToken,
        accessTokenExpiresIn,
        isRefreshing,
        login,
        logout,
        refresh
    };

    return (
        <AuthContext.Provider value={value}>
            {!isInitialized ? <LoadingPrincipal /> : children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};






