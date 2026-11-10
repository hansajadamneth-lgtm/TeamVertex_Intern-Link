import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
const offline = () => NextResponse.json({ success: false, message: "Configure BACKEND_URL and start Express/MongoDB to use the CV builder." }, { status: 503 });
export async function GET(request: Request) { return (await forwardToBackend(request, "/api/cvs")) ?? offline(); }
export async function POST(request: Request) { return (await forwardToBackend(request, "/api/cvs")) ?? offline(); }
