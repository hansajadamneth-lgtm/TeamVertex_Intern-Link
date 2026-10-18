import { NextResponse } from "next/server";

export async function GET() {
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
