import Image from "next/image";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";

const RECOMMENDED_JOBS = [
  {
    title: "Frontend engineer",
    company: "Horizon Labs",
    location: "Colombo",
    matchPercent: 84,
  },
  {
    title: "Product designer",
    company: "Northwind",
    location: "Remote",
    matchPercent: 90,
  },
  {
    title: "Data analyst",
    company: "Solvex",
    location: "Kandy",
    matchPercent: 84,
  },
  {
    title: "Data analyst",
    company: "Solvex",
    location: "Kandy",
    matchPercent: 84,
  },
];

export function RecommendedJobs() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-7 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/internlink-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-10 w-10 object-contain"
          />
          <h2 className="text-base font-semibold text-gray-900">
            Recommended for you
          </h2>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-il-orange">
          Welcome to InternLink
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {RECOMMENDED_JOBS.map((job, i) => (
          <JobCard key={i} {...job} />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" size="default" className="w-full rounded-none bg-gray-100 text-xs sm:flex-1">
          Build my cv
        </Button>
        <Button size="default" className="w-full rounded-none text-xs sm:flex-1">
          Generate Cover letter
        </Button>
      </div>
    </section>
  );
}
