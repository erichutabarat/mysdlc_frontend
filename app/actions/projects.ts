'use server'
import { backendUrl } from '@/lib/api';
import { cookies } from 'next/headers';

export async function getProjects() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${backendUrl}/api/v1/projects`, {  // ← full URL
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    return result.data;
}

export async function createProjects(form: any) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(
        `${backendUrl}/api/v1/projects`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to create project");
    }

    const result = await res.json();

    return result.data;
}