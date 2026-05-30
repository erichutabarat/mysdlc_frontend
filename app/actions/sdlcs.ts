'use server'

export async function getSDLCS() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sdlc`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();

    return result.data;
}