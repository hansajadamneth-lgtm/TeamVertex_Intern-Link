import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");
  const backend = process.env.BACKEND_URL || process.env.API_BASE_URL;
  if (!backend) return <div className="p-10 text-red-700">Admin verification unavailable: backend is not configured.</div>;
  let authorized = false;
  let reachable = true;
  try {
    const response = await fetch(`${(backend.endsWith("/") ? backend.slice(0, -1) : backend)}/api/auth/me`, {
      headers: { Cookie: `token=${token}` }, cache: "no-store",
      signal: AbortSignal.timeout(25000),
    });
    if (response.status === 401 || response.status === 403) redirect("/login");
    if (!response.ok) throw new Error("Backend temporarily unavailable.");
    const account = await response.json();
    authorized = account.success && account.user?.role === "admin";
  } catch (error) {
    // Do not misrepresent a cold start or network error as a revoked account.
    if (error && typeof error === "object" && "digest" in error) throw error;
    reachable = false;
  }
  if (!reachable) return <div className="min-h-screen bg-slate-50 p-10 text-slate-800"><h1 className="text-2xl font-bold">Admin temporarily unavailable</h1><p className="mt-3">The backend may be waking up on Render Free. Refresh when ready.</p></div>;
  if (!authorized) redirect("/home");

  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-[#f6f8fc] lg:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col bg-[#0b1b3e] text-white lg:sticky lg:top-0 lg:h-screen lg:w-64">
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
        <nav className="flex-1 overflow-x-auto px-3 py-3 lg:py-6">
          <div className="flex gap-2 lg:block lg:space-y-2">
            <Link
              href="/admin/dashboard"
             className="flex items-center gap-3 rounded-xl border border-orange-500 bg-orange-500/10 px-4 py-3 text-sm text-orange-500"
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
          <SignOutButton className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10" />
        </div>
      </aside>

      {/* Page content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}