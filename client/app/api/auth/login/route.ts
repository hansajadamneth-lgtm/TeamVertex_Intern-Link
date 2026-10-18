import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth-store";
import { forwardToBackend } from "@/lib/api-proxy";

export async function POST(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/auth/login");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback mode (when BACKEND_URL is not set)
  try {
    const body = await request.clone().json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    if (!user || (user.password && user.password !== password)) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      message: "Login successful!",
      user: safeUser,
      token: "preview-jwt-token-" + Date.now(),
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
