// utils/api.ts
export async function apiFetch(path: string, options: RequestInit = {}) {
    return fetch(`/api/proxy/${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}