import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth-store";
import { forwardToBackend } from "@/lib/api-proxy";

export async function POST(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/auth/forgot-password");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback mode (when BACKEND_URL is not set)
  try {
    const body = await request.clone().json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    // Don't leak whether email exists for security, or confirm reset sent
    return NextResponse.json({
      message: user
        ? "A password reset link and verification code have been dispatched."
        : "If this email is registered, password reset instructions have been sent.",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
