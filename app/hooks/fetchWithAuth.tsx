import { useAuth } from "../context/AuthContext";
export function useFetchWithAuth() {
    const { refresh, isRefreshing, accessToken } = useAuth();

    const authenticatedFetch = async (
        path: string,
        init?: RequestInit,
    ) => {
        const fetchPrivateData = () =>
            fetch(`/api/${path}`, {
                ...init,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                    ...init?.headers,
                },
            });

        let res = await fetchPrivateData();

        if (res.status === 200 || res.status === 201) return res;

        // 🔁 refresh
        if (!isRefreshing) {
            await refresh();
        }
        return fetchPrivateData();
    };

    return authenticatedFetch;
}
