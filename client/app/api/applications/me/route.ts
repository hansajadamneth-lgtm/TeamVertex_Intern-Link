import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/api-proxy";
export async function GET(request: Request) {
 return (await forwardToBackend(request, "/api/applications/me")) ??
 NextResponse.json({success:false,message:"Backend is not configured; live applications are unavailable."},{status:503});
}
