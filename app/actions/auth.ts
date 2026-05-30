'use server'

import { cookies } from 'next/headers';

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
        httpOnly: true, // Prevents JavaScript access (Security)
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}