import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteParams) {
  const { id } = await context.params;
  const backendResponse = await forwardToBackend(request, `/api/jobs/${id}`);
  if (backendResponse) {
    return backendResponse;
  }

  // Preview fallback
  return NextResponse.json({
    success: true,
    data: {
      _id: id,
      id,
      title: "Frontend engineer",
      companyName: "Horizon Labs",
      category: "IT",
      location: "Colombo",
      type: "Full Time",
      duration: "6 Months",
      description: "Build modern web applications with React and Next.js.",
      requirements: "React, TypeScript, CSS, Git",
      skills: ["React", "TypeScript", "Next.js"],
      status: "Active",
      match: 84,
      applicationsCount: 24,
      createdAt: new Date().toISOString(),
    },
  });
}

export async function PUT(request: Request, context: RouteParams) {
  const { id } = await context.params;
  const backendResponse = await forwardToBackend(request, `/api/jobs/${id}`);
  if (backendResponse) {
    return backendResponse;
  }

  try {
    const body = await request.clone().json();
    return NextResponse.json({
      success: true,
      message: "Job updated successfully (preview mode)",
      data: { _id: id, ...body },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: RouteParams) {
  const { id } = await context.params;
  const backendResponse = await forwardToBackend(request, `/api/jobs/${id}`);
  if (backendResponse) {
    return backendResponse;
  }

  return NextResponse.json({
    success: true,
    message: "Job removed successfully (preview mode)",
  });
}
