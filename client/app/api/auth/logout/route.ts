import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Signed out." });
  response.cookies.set("token", "", { httpOnly: true, path: "/", sameSite: "lax", maxAge: 0, secure: process.env.NODE_ENV === "production" });
  return response;
}
