import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";

const initialJobs = [
  {
    _id: "job-1",
    id: 1,
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
  {
    _id: "job-2",
    id: 2,
    title: "Digital marketing intern",
    companyName: "Northwind",
    category: "Marketing",
    location: "Remote",
    type: "Remote",
    duration: "3 Months",
    description: "Manage digital campaigns, social media, and search rankings.",
    requirements: "SEO, Social media, Content writing",
    skills: ["SEO", "Social Media", "Analytics"],
    status: "Active",
    match: 90,
    applicationsCount: 17,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "job-3",
    id: 3,
    title: "Financial analyst intern",
    companyName: "Solvex",
    category: "Finance",
    location: "Kandy",
    type: "Full Time",
    duration: "6 Months",
    description: "Assist with financial models and data analysis.",
    requirements: "Excel, Financial modeling, Basic accounting",
    skills: ["Financial Analysis", "Excel", "Reporting"],
    status: "Active",
    match: 84,
    applicationsCount: 15,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "job-4",
    id: 4,
    title: "Systems engineering intern",
    companyName: "Apex Technologies",
    category: "Engineering",
    location: "Colombo",
    type: "Hybrid",
    duration: "6 Months",
    description: "Collaborate with infrastructure and devops teams.",
    requirements: "Linux, Networking, Python basics",
    skills: ["Linux", "Cloud", "Networking"],
    status: "Active",
    match: 84,
    applicationsCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "job-5",
    id: 5,
    title: "Cloud solutions intern",
    companyName: "LSEG",
    category: "IT",
    location: "Colombo",
    type: "Full Time",
    duration: "6 Months",
    description: "Work on cloud deployment pipelines and microservices.",
    requirements: "Cloud architecture, Docker, CI/CD",
    skills: ["AWS", "Docker", "DevOps"],
    status: "Active",
    match: 72,
    applicationsCount: 31,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  // 1. Forward to real Express backend if configured
  const backendResponse = await forwardToBackend(request, "/api/jobs");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search") || searchParams.get("keyword");
  const type = searchParams.get("type");

  let filtered = [...initialJobs];

  if (category && category !== "All") {
    filtered = filtered.filter((j) => j.category.toLowerCase() === category.toLowerCase());
  }

  if (type && type !== "All") {
    filtered = filtered.filter((j) => j.type.toLowerCase() === type.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(term) ||
        j.companyName.toLowerCase().includes(term) ||
        j.location.toLowerCase().includes(term)
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
  const backendResponse = await forwardToBackend(request, "/api/jobs");
  if (backendResponse) {
    return backendResponse;
  }

  // 2. Local preview fallback
  try {
    const body = await request.clone().json();
    const newJob = {
      _id: "job-" + Date.now(),
      id: Date.now(),
      ...body,
      status: body.status || "Active",
      createdAt: new Date().toISOString(),
      applicationsCount: 0,
    };
    return NextResponse.json(
      {
        success: true,
        message: "Job created successfully (preview mode)",
        data: newJob,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request payload" },
      { status: 400 }
    );
  }
}
