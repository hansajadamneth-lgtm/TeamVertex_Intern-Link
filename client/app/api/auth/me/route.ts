import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

export async function GET(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/auth/me");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback mode (when BACKEND_URL is not set)
  return NextResponse.json({
    success: true,
    user: {
      id: "preview-user-1",
      fullName: "Hansaja Damneth",
      email: "hansaja@example.com",
      role: "student",
      phone: "+94 77 123 4567",
      location: "Colombo, Sri Lanka",
      education: "BSc in Computer Science",
      bio: "Passionate software engineering student eager to contribute to innovative tech solutions.",
      skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
      status: "Active",
      createdAt: new Date().toISOString(),
    },
  });
}
