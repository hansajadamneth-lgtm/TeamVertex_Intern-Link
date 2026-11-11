import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

const unavailable = () => NextResponse.json(
  { success: false, message: "InternLink API is temporarily unavailable." },
  { status: 503 }
);

export async function GET(request: Request) {
  return (await forwardToBackend(request, "/api/jobs")) ?? unavailable();
}

export async function POST(request: Request) {
  return (await forwardToBackend(request, "/api/jobs")) ?? unavailable();
}
