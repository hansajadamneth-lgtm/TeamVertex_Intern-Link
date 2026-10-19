import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

export async function GET(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/admin/stats");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback
  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalUsers: 2450,
        totalStudents: 2368,
        totalEmployers: 82,
        totalCompanies: 82,
        verifiedCompanies: 65,
        pendingCompanies: 15,
        suspendedCompanies: 2,
        totalJobs: 135,
        activeJobs: 135,
        totalApplications: 4650,
      },
      recentJobs: [
        {
          title: "Software Engineering Intern",
          company: "ABC Technologies",
          status: "Active",
          date: "20 Jul 2026",
        },
        {
          title: "UI/UX Design Intern",
          company: "DesignHub",
          status: "Pending",
          date: "18 Jul 2026",
        },
        {
          title: "Marketing Intern",
          company: "MarketBridge",
          status: "Active",
          date: "16 Jul 2026",
        },
        {
          title: "Data Science Intern",
          company: "InnovateX Labs",
          status: "Closed",
          date: "14 Jul 2026",
        },
      ],
      recentUsers: [
        {
          name: "John Perera",
          email: "john@example.com",
          type: "Student",
        },
        {
          name: "Sarah Fernando",
          email: "sarah@example.com",
          type: "Student",
        },
        {
          name: "Tech Solutions",
          email: "contact@tech.lk",
          type: "Company",
        },
        {
          name: "DesignHub",
          email: "hello@designhub.lk",
          type: "Company",
        },
      ],
    },
  });
}
