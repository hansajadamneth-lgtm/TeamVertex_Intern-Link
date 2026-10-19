import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

export async function GET(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/admin/reports");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback
  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalApplications: 110,
        totalCompanies: 82,
        totalInternships: 42,
        totalStudents: 2450,
      },
      jobsByStatus: {
        Active: 28,
        Pending: 9,
        Closed: 5,
      },
      applicationsByStatus: {
        "Application sent": 45,
        "Under review": 35,
        "Interview scheduled": 20,
        Accepted: 10,
      },
    },
  });
}
