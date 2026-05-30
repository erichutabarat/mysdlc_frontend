'use server'
import { cookies } from 'next/headers';

export async function getProjects() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();

    return result.data;
}