import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

export async function POST(request: Request) {
  return (await forwardToBackend(request, "/api/auth/forgot-password")) ??
    NextResponse.json({
      success: false,
      message: "Password recovery is unavailable without the backend. Sign in and change your password under Settings, or contact the platform administrator.",
    }, { status: 503 });
}
