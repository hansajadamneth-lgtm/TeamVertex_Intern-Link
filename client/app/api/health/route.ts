import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "InternLink backend is running",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
