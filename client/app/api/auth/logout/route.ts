import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  const site = request.headers.get("sec-fetch-site");
  // Even a logout endpoint must not be triggerable by another website.
  if (site === "cross-site" || (origin && origin !== url.origin)) {
    return NextResponse.json(
      { success: false, message: "Request origin is not permitted." },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  const response = NextResponse.json(
    { success: true, message: "Signed out" },
    { headers: { "Cache-Control": "no-store" } }
  );
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}
