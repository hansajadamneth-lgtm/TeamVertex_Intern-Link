"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JobSearchHero } from "@/components/job-search-hero";
import { RecommendedJobs } from "@/components/recommended-jobs";
import { Footer } from "@/components/footer";

/** Redirect signed-in employer/admin users to the tools for their role. */
export function HomeRoleContent() {
  const router = useRouter();
  const [view, setView] = useState<"checking" | "student" | "redirecting">("checking");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store", credentials: "include" })
      .then(async response => response.ok ? response.json() : null)
      .then(data => {
        if (!active) return;
        if (data?.success && data.user?.role === "employer") {
          setView("redirecting");
          router.replace("/employer");
        } else if (data?.success && data.user?.role === "admin") {
          setView("redirecting");
          router.replace("/admin/dashboard");
        } else setView("student");
      })
      .catch(() => { if (active) setView("student"); });
    return () => { active = false; };
  }, [router]);

  if (view !== "student") return (
    <main className="min-h-[55vh] bg-[#0b1b3e] px-5 py-20 text-center text-white" role="status">
      <p className="text-sm font-semibold">Opening InternLink...</p>
    </main>
  );

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <JobSearchHero />
      <RecommendedJobs />
      <Footer />
    </main>
  );
}
