import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

export async function POST(request: Request) {
  return (await forwardToBackend(request, "/api/auth/change-password")) ??
    NextResponse.json({ success: false, message: "Backend unavailable." }, { status: 503 });
}
