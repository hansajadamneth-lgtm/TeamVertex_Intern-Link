import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
export async function DELETE(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await context.params;
  if (!/^[0-9a-f]{24}$/i.test(jobId)) return NextResponse.json({ success: false, message: "Invalid internship ID" }, { status: 400 });
  return (await forwardToBackend(request, `/api/saved-jobs/${jobId}`)) ??
    NextResponse.json({ success: false, message: "Backend unavailable" }, { status: 503 });
}
