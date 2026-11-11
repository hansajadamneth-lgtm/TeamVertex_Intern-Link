"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Sparkles } from "lucide-react";

type Job = {
  _id: string; title: string; companyName: string; location: string; category?: string;
  type?: string; match?: number; matchedSkills?: string[];
};

export function RecommendedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [personalized, setPersonalized] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const recommendations = await fetch("/api/recommendations", { cache: "no-store" });
        if (recommendations.ok) {
          const data = await recommendations.json();
          if (data.success && active) {
            setJobs((data.data || []).slice(0, 4));
            setPersonalized(Boolean(data.profileComplete));
            return;
          }
        }
        const response = await fetch("/api/jobs?limit=4", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Internships are unavailable.");
        if (active) { setJobs((data.data || []).slice(0, 4)); setPersonalized(false); }
      } catch (error) {
        if (active) setMessage(error instanceof Error ? error.message : "Unable to load internships.");
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <section id="recommendations" className="relative mx-auto -mt-8 w-full max-w-6xl rounded-3xl border border-slate-100 bg-white px-6 py-10 shadow-[0_18px_60px_-25px_rgba(11,27,62,0.25)] lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-[#17233b]"><Sparkles className="text-[#ff7417]" /> {personalized ? "Recommended for you" : "Explore verified internships"}</h2>
          <p className="mt-2 text-sm text-slate-500">{personalized ? "Skill-based matches from your profile and CV." : "Sign in and add your skills to see personalized matches."}</p>
        </div>
        <Link href="/recommendations" className="rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-[#e96d00] hover:bg-orange-50">All matches</Link>
      </div>
      {loading && <p className="mt-7 text-sm text-slate-500">Loading verified internships...</p>}
      {message && <p role="alert" className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-700">{message}</p>}
      {!loading && !message && jobs.length === 0 && (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <BriefcaseBusiness className="mx-auto mb-3 h-8 w-8 text-orange-500" />
          <p className="font-semibold">No verified internships published yet.</p>
          <p className="mt-2 text-sm text-slate-500">Once employers are verified and publish listings, they will appear here.</p>
        </div>
      )}
      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {jobs.map(job => (
          <Link key={job._id} href={`/job-details?job=${encodeURIComponent(job._id)}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#e96d00]">{job.category || "Internship"}</span>
            <h3 className="mt-2 text-lg font-bold text-[#17233b]">{job.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{job.companyName} · {job.location}</p>
            <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>{job.type || "Internship"}</span>
              {personalized && typeof job.match === "number" && <span className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700">{job.match}% skills match</span>}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="/cv-builder" className="rounded-xl bg-[#0b1b3e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#14305e]">Build my CV</Link>
        <Link href="/profile/edit" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-[#17233b] hover:bg-slate-50">Update my skills</Link>
      </div>
    </section>
  );
}
