import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8080'
    : 'http://backend:8080';

async function handler(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullPath = path.join("/");
    const search = req.nextUrl.search;
    const isFormData = req.headers
        .get("content-type")
        ?.includes("multipart/form-data");

    const res = await fetch(
        `${API_URL}/api/v1/${fullPath}${search}`,
        {
            method: req.method,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(!isFormData && { "Content-Type": "application/json" }),
            },
            body: ["GET", "HEAD"].includes(req.method)
                ? undefined
                : isFormData
                    ? req.body
                    : await req.text(),
            duplex: "half",
        } as RequestInit
    );

    const data = await res.text();
    return new NextResponse(data, { status: res.status });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;