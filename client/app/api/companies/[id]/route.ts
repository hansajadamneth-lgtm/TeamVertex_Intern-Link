import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteParams) {
  const { id } = await context.params;
  const backendResponse = await forwardToBackend(request, `/api/companies/${id}`);
  if (backendResponse) {
    return backendResponse;
  }

  return NextResponse.json({
    success: true,
    data: {
      _id: id,
      id,
      name: "Tech Solutions Lanka",
      industry: "Information Technology",
      email: "contact@techsolutions.lk",
      website: "https://techsolutions.lk",
      status: "Verified",
      joinedDate: "10 Jan 2026",
    },
  });
}

export async function PUT(request: Request, context: RouteParams) {
  const { id } = await context.params;
  const backendResponse = await forwardToBackend(request, `/api/companies/${id}`);
  if (backendResponse) {
    return backendResponse;
  }

  try {
    const body = await request.clone().json();
    return NextResponse.json({
      success: true,
      message: "Company updated successfully (preview mode)",
      data: { _id: id, ...body },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
