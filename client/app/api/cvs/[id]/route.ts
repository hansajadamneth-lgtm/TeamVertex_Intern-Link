import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
type Ctx = { params: Promise<{ id: string }> };
const offline = () => NextResponse.json({ success: false, message: "Backend unavailable. Check BACKEND_URL." }, { status: 503 });
export async function PUT(request: Request, context: Ctx) {
  const { id } = await context.params;
  return (await forwardToBackend(request, "/api/cvs/" + encodeURIComponent(id))) ?? offline();
}
export async function DELETE(request: Request, context: Ctx) {
  const { id } = await context.params;
  return (await forwardToBackend(request, "/api/cvs/" + encodeURIComponent(id))) ?? offline();
}
