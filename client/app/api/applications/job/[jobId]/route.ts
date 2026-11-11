import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
export async function GET(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await context.params;
  if (!/^[a-f0-9]{24}$/i.test(jobId)) return NextResponse.json({ success: false, message: "Invalid job ID" }, { status: 400 });
  return (await forwardToBackend(request, `/api/applications/job/${jobId}`)) ??
    NextResponse.json({ success: false, message: "Backend unavailable" }, { status: 503 });
}
