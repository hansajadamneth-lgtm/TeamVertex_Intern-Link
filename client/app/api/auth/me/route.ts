import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
const unavailable = () => NextResponse.json({ success: false, message: "Connect the Express backend with BACKEND_URL to use real authentication." }, { status: 503 });
export async function GET(request: Request) { return (await forwardToBackend(request, "/api/auth/me")) ?? unavailable(); }

export async function PUT(request: Request) { return (await forwardToBackend(request, "/api/auth/me")) ?? unavailable(); }
