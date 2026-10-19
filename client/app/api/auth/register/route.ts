import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/auth-store";
import { forwardToBackend } from "@/lib/api-proxy";

export async function POST(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/auth/register");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback mode (when BACKEND_URL is not set)
  try {
    const body = await request.clone().json();
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const newUser = createUser({
      fullName,
      email,
      password,
      role: role || "student",
    });

    const safeUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json({
      message: "Registration successful!",
      user: safeUser,
    });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
