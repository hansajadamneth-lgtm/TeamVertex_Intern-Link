import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

export async function POST(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/applications");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback
  try {
    const body = await request.clone().json();
    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully (preview mode)",
        data: {
          _id: "app-" + Date.now(),
          student: "preview-user-1",
          job: body.jobId || body.job,
          status: "Application sent",
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid application submission payload" },
      { status: 400 }
    );
  }
}
