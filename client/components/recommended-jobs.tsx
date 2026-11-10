import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileText, Sparkles } from "lucide-react";

export function RecommendedJobs() {
  return (
    <section id="recommendations" className="relative mx-auto -mt-10 w-full max-w-6xl px-5 pb-20 lg:px-10">
      <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_20px_65px_rgba(15,23,42,0.09)] sm:p-9">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Made for your next step</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0b1b3e] sm:text-3xl">Find your perfect fit</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Build your CV to unlock skill-based internship recommendations with explainable match scores.</p>
          </div>
          <Link href="/recommendations" className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0b1b3e] transition hover:border-orange-300 hover:bg-orange-50">View recommendations <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/job-details" className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><BriefcaseBusiness className="h-6 w-6" /></span>
            <h3 className="mt-5 text-lg font-bold text-[#0b1b3e]">Explore internships</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Browse available opportunities and find a role that fits your goals.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">Browse jobs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
          <Link href="/cv-builder" className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700"><FileText className="h-6 w-6" /></span>
            <h3 className="mt-5 text-lg font-bold text-[#0b1b3e]">Build your CV</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Showcase your skills and experience with a professional CV.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">Create CV <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
          <Link href="/recommendations" className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Sparkles className="h-6 w-6" /></span>
            <h3 className="mt-5 text-lg font-bold text-[#0b1b3e]">Skill-based matches</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">See real recommendations based on the skills in your profile.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">See matches <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </div>
        <p className="mt-5 text-xs text-slate-400">Recommendations are calculated from your saved skills and available internship listings; sample match percentages are not shown.</p>
      </div>
    </section>
  );
}
