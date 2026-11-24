import { useAuth } from "../context/AuthContext";
export function useFetchWithAuth() {
    const { refresh, accessToken } = useAuth();

    const authenticatedFetch = async (
        path: string,
        init?: RequestInit,
    ) => {
        const apiPath = path.replace(/^\/+/, "").replace(/^api\/+/, "");
        const headers = new Headers(init?.headers);
        if (!headers.has("Content-Type") && init?.body != null) {
            headers.set("Content-Type", "application/json");
        }

        const fetchPrivateData = (token: string | null) => {
            const requestHeaders = new Headers(headers);
            if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
            else requestHeaders.delete("Authorization");

            return fetch(`/api/${apiPath}`, {
                ...init,
                credentials: "include",
                headers: requestHeaders,
            });
        };

        const res = await fetchPrivateData(accessToken);

        if (res.status !== 401) return res;

        const refreshedToken = await refresh();
        if (!refreshedToken) return res;
        return fetchPrivateData(refreshedToken);
    }

    return authenticatedFetch;
}
