import { NextResponse } from "next/server";
import { forwardToBackend, isBackendConfigured } from "@/lib/api-proxy";

export async function GET(request: Request) {
  // If backend is configured, probe it
  if (isBackendConfigured()) {
    const backendResponse = await forwardToBackend(request, "/api/health");
    if (backendResponse) {
      return backendResponse;
    }
  }

  // Preview mode is never considered healthy in production.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { status: "unavailable", message: "Backend service is not configured." },
      { status: 503 }
    );
  }

  // Local development preview only.
  return NextResponse.json({
    status: "ok",
    message: "InternLink Next.js web application is operational",
    backendConfigured: isBackendConfigured(),
    mode: isBackendConfigured() ? "live-proxy" : "local-preview",
    timestamp: new Date().toISOString(),
  });
}
