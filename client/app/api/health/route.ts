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

  // Next.js client proxy fallback
  return NextResponse.json({
    status: "ok",
    message: "InternLink Next.js web application is operational",
    backendConfigured: isBackendConfigured(),
    mode: isBackendConfigured() ? "live-proxy" : "local-preview",
    timestamp: new Date().toISOString(),
  });
}
