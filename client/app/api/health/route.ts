import { NextResponse } from "next/server";
import { forwardToBackend, isBackendConfigured } from "@/lib/api-proxy";

export async function GET(request: Request) {
  if (isBackendConfigured()) {
    // Preserve backend response status (including 503) instead of disguising a failed API.
    return (await forwardToBackend(request, "/api/health")) ??
      NextResponse.json({ status: "error", message: "Backend is unavailable" }, { status: 503 });
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { status: "error", backendConfigured: false, message: "BACKEND_URL is missing" },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: "ok",
    message: "InternLink Next.js local preview is running",
    backendConfigured: false,
    mode: "local-preview",
    timestamp: new Date().toISOString(),
  });
}
