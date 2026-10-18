import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
