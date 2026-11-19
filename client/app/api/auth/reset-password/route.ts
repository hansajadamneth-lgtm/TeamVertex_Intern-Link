import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

export async function POST(request: Request) {
  return (await forwardToBackend(request, "/api/auth/reset-password")) ??
    NextResponse.json(
      { success: false, message: "Password reset is unavailable without the backend." },
      { status: 503 }
    );
}
