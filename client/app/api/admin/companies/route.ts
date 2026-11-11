import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

export async function GET(request: Request) {
  return (await forwardToBackend(request, "/api/admin/companies")) ??
    NextResponse.json({ success: false, message: "Backend unavailable" }, { status: 503 });
}
