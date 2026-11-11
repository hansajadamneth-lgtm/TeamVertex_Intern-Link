import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[0-9a-f]{24}$/i.test(id)) return NextResponse.json(
    { success: false, message: "Invalid student ID" }, { status: 400 }
  );
  return (await forwardToBackend(request, `/api/admin/students/${id}/status`)) ??
    NextResponse.json({ success: false, message: "Backend unavailable" }, { status: 503 });
}
