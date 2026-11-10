import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
export async function POST(request: Request) {
 return (await forwardToBackend(request, "/api/applications")) ??
 NextResponse.json({success:false,message:"Backend is not configured; applications cannot be saved in preview mode."},{status:503});
}
