import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
const offline = () => NextResponse.json({ success: false, message: "Backend unavailable" }, { status: 503 });
export async function GET(request: Request) { return (await forwardToBackend(request, "/api/saved-jobs")) ?? offline(); }
export async function POST(request: Request) { return (await forwardToBackend(request, "/api/saved-jobs")) ?? offline(); }
