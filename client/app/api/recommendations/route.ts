import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
export async function GET(request: Request) {
  return (await forwardToBackend(request, "/api/recommendations")) ??
    NextResponse.json({ success: false, message: "Start the backend and set BACKEND_URL to load real recommendations." }, { status: 503 });
}
