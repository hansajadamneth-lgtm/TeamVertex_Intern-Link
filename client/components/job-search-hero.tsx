"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Search, Sparkles } from "lucide-react";

export function JobSearchHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const search = query.trim();
    router.push(search ? `/job-details?query=${encodeURIComponent(search)}` : "/job-details");
  }

  return (
    <section className="relative isolate overflow-hidden rounded-b-[2rem] bg-[#0b1b3e] px-5 pb-20 pt-14 text-white sm:pb-24 sm:pt-20 lg:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 -left-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-orange-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-orange-200"><Sparkles className="h-4 w-4" /> Your career starts here</span>
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Discover opportunities.<br /><span className="text-[#ff963e]">Build your future.</span></h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Find internships that match your skills, create a standout CV, and take the next step in your career.</p>
        <form onSubmit={handleSearch} className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 sm:flex-row">
          <label htmlFor="internship-search" className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input id="internship-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search roles, companies, or skills..." className="h-12 w-full rounded-xl bg-transparent pl-12 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200" />
          </label>
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f5821f] px-7 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">Find internships <ArrowRight className="h-4 w-4" /></button>
        </form>
        <p className="mt-5 inline-flex items-center gap-2 text-xs text-slate-400"><BriefcaseBusiness className="h-4 w-4" /> Explore roles, build your CV, and manage applications in one place</p>
      </div>
    </section>
  );
}
