import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

const initialCompanies = [
  {
    _id: "comp-1",
    id: 1,
    name: "Tech Solutions Lanka",
    industry: "Information Technology",
    email: "contact@techsolutions.lk",
    website: "https://techsolutions.lk",
    status: "Verified",
    joinedDate: "10 Jan 2026",
  },
  {
    _id: "comp-2",
    id: 2,
    name: "Innovate Sri Lanka",
    industry: "Innovation & Design",
    email: "hello@innovatesl.lk",
    website: "https://innovatesl.lk",
    status: "Verified",
    joinedDate: "15 Jan 2026",
  },
  {
    _id: "comp-3",
    id: 3,
    name: "Future Tech",
    industry: "Information Technology",
    email: "info@futuretech.lk",
    website: "https://futuretech.lk",
    status: "Pending",
    joinedDate: "02 Feb 2026",
  },
  {
    _id: "comp-4",
    id: 4,
    name: "ABC Technologies (Pvt) Ltd",
    industry: "Software Engineering",
    email: "contact@abctech.com",
    website: "https://abctech.com",
    status: "Verified",
    joinedDate: "10 Jan 2026",
  },
  {
    _id: "comp-5",
    id: 5,
    name: "DesignHub (Pvt) Ltd",
    industry: "Design & UX",
    email: "hello@designhub.lk",
    website: "https://designhub.lk",
    status: "Verified",
    joinedDate: "18 Jan 2026",
  },
];

export async function GET(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/companies");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || searchParams.get("keyword");
  const status = searchParams.get("status");

  let filtered = [...initialCompanies];

  if (status && status !== "all") {
    filtered = filtered.filter((c) => c.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.industry.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    total: filtered.length,
    data: filtered,
  });
}

export async function POST(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/companies");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback
  try {
    const body = await request.clone().json();
    const newCompany = {
      _id: "comp-" + Date.now(),
      id: Date.now(),
      ...body,
      status: "Pending",
      joinedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    return NextResponse.json(
      {
        success: true,
        message: "Company registered successfully (preview mode)",
        data: newCompany,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid company payload" },
      { status: 400 }
    );
  }
}
