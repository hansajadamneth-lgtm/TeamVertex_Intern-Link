import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

type Context = { params: Promise<{ id: string }> };
const unavailable = () => NextResponse.json(
  { success: false, message: "InternLink API is temporarily unavailable." }, { status: 503 }
);

export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ success: false, message: "Invalid resource ID." }, { status: 400 });
  }
  return (await forwardToBackend(request, `/api/jobs/${id}`)) ?? unavailable();
}

export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ success: false, message: "Invalid resource ID." }, { status: 400 });
  }
  return (await forwardToBackend(request, `/api/jobs/${id}`)) ?? unavailable();
}

export async function DELETE(request: Request, context: Context) {
  const { id } = await context.params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ success: false, message: "Invalid resource ID." }, { status: 400 });
  }
  return (await forwardToBackend(request, `/api/jobs/${id}`)) ?? unavailable();
}
