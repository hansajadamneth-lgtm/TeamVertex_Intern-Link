"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobSearchHero() {
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Wire up to your real search logic here.
  }

  return (
    <div className="rounded-b-xl bg-il-navy px-5 pb-6 pt-8 text-center sm:pb-8 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold text-white sm:text-2xl">
          All the jobs. One place.
        </h1>
        <p className="mt-1 text-xs text-gray-300 sm:text-sm">
          Search, build your CV, and apply with AI on your side.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-5 flex max-w-xl flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job Title, company or Keyword"
              className="h-9 w-full rounded-none border-0 bg-white/95 pl-10 pr-4 text-[11px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-il-orange/50"
            />
          </div>
          <Button type="submit" size="lg" className="sm:w-auto">
            Search
          </Button>
        </form>
      </div>
    </div>
  );
}
