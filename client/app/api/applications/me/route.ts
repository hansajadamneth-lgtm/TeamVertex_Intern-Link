import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

const initialApplications = [
  {
    _id: "app-1",
    company: "WSO2 Lanka",
    position: "Associate Software Engineer",
    date: "July 16, 2025",
    fit: 94,
    status: "Interview scheduled",
    action: "View Invite",
  },
  {
    _id: "app-2",
    company: "Dialog Axiata PLC",
    position: "Full-Stack Web Intern",
    date: "July 14, 2025",
    fit: 89,
    status: "Under review",
    action: "Details Pending",
  },
  {
    _id: "app-3",
    company: "Sysco LABS",
    position: "Quality Assurance Intern",
    date: "July 12, 2025",
    fit: 86,
    status: "Application sent",
    action: "Download Copy",
  },
  {
    _id: "app-4",
    company: "London Stock Exchange Group",
    position: "Cloud Solutions Intern",
    date: "July 08, 2025",
    fit: 72,
    status: "Application sent",
    action: "Download Copy",
  },
];

export async function GET(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/applications/me");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback
  return NextResponse.json({
    success: true,
    count: initialApplications.length,
    data: initialApplications,
  });
}
