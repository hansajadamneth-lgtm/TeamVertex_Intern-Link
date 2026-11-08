import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The Express /api/auth/me endpoint validates the existing JWT cookie and
  // loads the current user from MongoDB. Never trust a browser-provided role.
  const backendUrl = process.env.BACKEND_URL || process.env.API_BASE_URL;
  if (!backendUrl) redirect("/login");

  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  // Fail closed if the backend is unavailable or the session is invalid.
  let response: Response;
  try {
    response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/auth/me`, {
      headers: { Cookie: `token=${encodeURIComponent(token)}` },
      cache: "no-store",
    });
  } catch {
    redirect("/login");
  }

  if (!response.ok) redirect("/login");
  let payload: { success?: boolean; user?: { role?: string } };
  try {
    payload = await response.json();
  } catch {
    redirect("/login");
  }
  if (!payload.success || !payload.user) redirect("/login");
  if (payload.user.role !== "admin") redirect("/home");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-[#0d172b] text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <Image
            src="/internlink-logo.png"
            alt="InternLink"
            width={50}
            height={50}
            className="rounded-full"
          />

          <div>
            <h1 className="text-xl font-semibold">InternLink</h1>
            <p className="text-xs text-gray-300">
              AI Recruitment Platform
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <div className="space-y-2">
            <Link
              href="/admin/dashboard"
             className="flex items-center gap-3 rounded-lg border border-orange-500 bg-orange-500/10 px-4 py-3 text-sm text-orange-500"
            >
              <span>▦</span>
              Dashboard
            </Link>

            <Link
              href="/admin/students"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
            >
              <span>♙</span>
              Students
            </Link>

            <Link
              href="/admin/companies"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
            >
              <span>▥</span>
              Companies
            </Link>

            <Link
              href="/admin/internship-posts"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
            >
              <span>▤</span>
              Internship Posts
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
            >
              <span>▥</span>
              Reports
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <Link href="/login" className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10">
            <span>⇥</span>
            Logout
          </Link>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}