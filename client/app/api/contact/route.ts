import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

const unavailable = () => NextResponse.json(
  { success: false, message: "Contact service is temporarily unavailable." },
  { status: 503 }
);

export async function POST(request: Request) {
  return (await forwardToBackend(request, "/api/contact")) ?? unavailable();
}
export async function GET(request: Request) {
  return (await forwardToBackend(request, "/api/contact")) ?? unavailable();
}
