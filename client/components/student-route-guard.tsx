"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/**
 * Presentation-only route gate. Express protects all student API endpoints.
 * Avoid rendering student forms to employers/admins or unauthenticated visitors.
 */
const studentRoutes = new Set([
  "/cv-builder",
  "/saved-jobs",
  "/applications",
  "/recommendations",
  "/notifications",
  "/cover-letter",
]);

type GateStatus = "loading" | "allowed" | "signin" | "unavailable";

export function StudentRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const restricted = [...studentRoutes].some(path => pathname === path || pathname.startsWith(path + "/"));
  const [status, setStatus] = useState<GateStatus>("loading");
  const [checkedPath, setCheckedPath] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!restricted) return;
    let cancelled = false;
    async function check() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
        if (cancelled) return;
        if (response.status === 401) {
          setStatus("signin");
          setCheckedPath(pathname);
          return;
        }
        if (!response.ok) throw new Error("Authentication service unavailable");
        const data = await response.json();
        if (cancelled) return;
        if (!data.success || !data.user) throw new Error("Unable to verify account role");
        if (data.user.role === "student") {
          setStatus("allowed");
        } else if (data.user.role === "employer") {
          router.replace("/employer");
          setStatus("loading");
        } else if (data.user.role === "admin") {
          router.replace("/admin/dashboard");
          setStatus("loading");
        } else {
          setStatus("signin");
        }
        setCheckedPath(pathname);
      } catch {
        if (!cancelled) {
          setCheckedPath(pathname);
          setStatus("unavailable");
        }
      }
    }
    void check();
    return () => { cancelled = true; };
  }, [pathname, restricted, attempt, router]);

  if (!restricted) return <>{children}</>;
  if (checkedPath === pathname && status === "allowed") return <>{children}</>;

  return (
    <main className="min-h-[60vh] bg-[#f6f8fc] px-5 py-16 text-[#17233b]">
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" role="status">
        {checkedPath !== pathname || status === "loading" ? (
          <p className="text-sm text-slate-600">Checking access to student features...</p>
        ) : status === "signin" ? (
          <>
            <h1 className="text-2xl font-bold">Student account required</h1>
            <p className="mt-3 text-sm text-slate-600">Sign in with a student account to use the CV Builder, save internships and manage applications.</p>
            <Link className="mt-6 inline-block rounded-xl bg-[#ff7417] px-5 py-3 text-sm font-bold text-white" href="/login">Sign in as Student</Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Account verification unavailable</h1>
            <p className="mt-3 text-sm text-slate-600">The backend may be starting up on Render Free. Your access has not been changed.</p>
            <button type="button" className="mt-6 rounded-xl bg-[#0b1b3e] px-5 py-3 text-sm font-bold text-white" onClick={() => { setStatus("loading"); setAttempt(x => x + 1); }}>Retry</button>
          </>
        )}
      </section>
    </main>
  );
}
