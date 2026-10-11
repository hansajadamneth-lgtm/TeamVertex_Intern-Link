"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const jobs = [
  { title: "Associate Software Engineer", company: "TechNova Solutions", location: "Colombo", match: 92, skills: "React · TypeScript · REST" },
  { title: "Full-Stack Web Intern", company: "InnovateX Labs", location: "Kandy", match: 86, skills: "Node.js · MongoDB · Git" },
  { title: "Quality Assurance Intern", company: "DesignHub", location: "Remote", match: 78, skills: "Testing · JavaScript · Agile" },
];

export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fa] text-[#17233b]">
      <Header active="Recommendations" />
      <section className="mx-auto max-w-[1120px] px-5 pb-20 pt-10 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#ff7417]" />
              <h1 className="text-2xl font-semibold">AI Smart Match Recommendations</h1>
              <span className="rounded bg-[#fff0e5] px-2 py-1 text-[8px] font-semibold uppercase text-[#e86b18]">AI v1.0</span>
            </div>
            <p className="mt-1 text-[11px] text-[#7b8799]">Roles selected from your profile, skills, and application history.</p>
          </div>
          <Link href="/job-details" className="text-[10px] font-semibold text-[#ff7417] hover:underline">Browse all jobs</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {jobs.map((job) => (
            <article key={job.title} className="rounded-lg border border-[#dce3eb] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded bg-[#fff0e5] px-2 py-1 text-[8px] font-semibold uppercase text-[#e86b18]">Top match</span>
                <span className="text-sm font-bold text-[#ff7417]">{job.match}%</span>
              </div>
              <h2 className="mt-5 text-sm font-semibold">{job.title}</h2>
              <p className="mt-1 text-[11px] text-[#667085]">{job.company} · {job.location}</p>
              <p className="mt-5 text-[10px] text-[#667085]">{job.skills}</p>
              <Link href="/job-details" className="mt-6 block rounded-full bg-[#0b142b] py-2 text-center text-[10px] font-semibold text-white hover:bg-[#182647]">Apply now</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Header({ active }: { active: string }) {
  const links = [["AI Cover Letter", "/cover-letter"], ["Recommendations", "/recommendations"], ["Applications", "/applications"], ["Notifications", "/notifications"]];
  return (
    <header className="bg-[#0b142b] px-4 py-3 sm:px-8">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between">
        <Link href="/home" aria-label="InternLink home" className="flex h-10 w-10 items-center justify-center overflow-hidden bg-white">
          <img src="/internlink-logo.png" alt="InternLink" className="h-full w-full object-contain" />
        </Link>
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1 text-[9px] text-white sm:flex">
          {links.map(([label, href]) => <Link key={label} href={href} className={`rounded-md px-3 py-2 ${label === active ? "bg-[#ff7417] font-semibold" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{label}</Link>)}
        </div>
        <Link href="/login" className="rounded-full bg-[#ff7417] px-5 py-2 text-[8px] font-semibold uppercase text-white">Sign out</Link>
      </nav>
    </header>
  );
}
