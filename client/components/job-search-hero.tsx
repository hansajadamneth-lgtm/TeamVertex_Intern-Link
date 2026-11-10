"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobSearchHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();
    router.push(search ? `/job-details?query=${encodeURIComponent(search)}` : "/job-details");
  }

  return (
    <section className="relative isolate overflow-hidden rounded-b-[2.25rem] bg-[linear-gradient(125deg,#08152e_0%,#0b1b3e_40%,#14305e_100%)] px-5 pb-24 pt-16 text-center text-white sm:pb-28 sm:pt-20 lg:px-10">
      {/* Visual interest without external images or additional downloads. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 25%, rgba(245,130,31,.21), transparent 28%), radial-gradient(circle at 87% 28%, rgba(255,255,255,.09), transparent 25%), radial-gradient(circle at 75% 82%, rgba(245,130,31,.11), transparent 28%), linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "auto, auto, auto, 36px 36px, 36px 36px",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 bottom-[-170px] h-96 w-96 rounded-full border border-[#f5821f]/30 bg-[#f5821f]/10 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full border border-white/10 bg-blue-300/10 blur-2xl" />

      <div className="relative mx-auto max-w-5xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-orange-100 shadow-lg backdrop-blur-lg">
          <Sparkles className="h-4 w-4 text-[#f5821f]" aria-hidden="true" />
          Your career starts here
        </span>
        <h1 className="mt-7 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          All the jobs. <span className="text-[#ffac62]">One place.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
          Search, build your CV, and apply with AI on your side.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-9 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-white/20 bg-white/95 p-2.5 shadow-[0_24px_60px_-25px_rgba(0,0,0,.6)] backdrop-blur-xl sm:flex-row"
        >
          <label htmlFor="home-job-search" className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="home-job-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Job title, company or keyword"
              className="h-12 w-full min-w-0 rounded-xl border-0 bg-transparent pl-12 pr-4 text-sm text-[#17233b] outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#f5821f]/30"
            />
          </label>
          <Button type="submit" size="lg" className="h-12 gap-2 rounded-xl px-7 shadow-md sm:w-auto">
            Search <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>

        <div className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-200">
          <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-[#ffac62]" aria-hidden="true" /> Discover internships</span>
          <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#ffac62]" aria-hidden="true" /> Build your future</span>
        </div>
      </div>
    </section>
  );
}
