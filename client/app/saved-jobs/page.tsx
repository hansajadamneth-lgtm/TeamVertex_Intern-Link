"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";

type Job = {
  id: number;
  category: string;
  title: string;
  company: string;
  location: string;
  match: number;
  saved: boolean;
  age: string;
};

const initialJobs: Job[] = [
  { id: 1, category: "IT", title: "Frontend engineer", company: "Horizon Labs", location: "Colombo", match: 84, saved: true, age: "2 days ago" },
  { id: 2, category: "Marketing", title: "Digital marketing intern", company: "Northwind", location: "Remote", match: 90, saved: true, age: "4 days ago" },
  { id: 3, category: "Finance", title: "Financial analyst intern", company: "Solvex", location: "Kandy", match: 84, saved: true, age: "6 days ago" },
  { id: 4, category: "Engineering", title: "Systems engineering intern", company: "Apex Technologies", location: "Colombo", match: 84, saved: true, age: "1 week ago" },
];

const categories = ["IT", "Marketing", "Finance", "Engineering"];

export default function SavedJobsPage() {
  const [activeCategory, setActiveCategory] = useState("IT");
  const [jobs, setJobs] = useState(initialJobs);
  const visibleJobs = jobs.filter((job) => job.category === activeCategory && job.saved);

  const toggleSaved = (id: number) => {
    setJobs((current) => current.map((job) => (job.id === id ? { ...job, saved: !job.saved } : job)));
  };

  return (
    <main className="min-h-screen bg-[#f1f1f1] text-[#111a2e]">
      <Header active="Saved" />
      <section className="mx-auto min-h-[calc(100vh-76px)] max-w-[1120px] bg-white px-5 pb-20 pt-6 sm:px-10">
        <h1 className="text-xl font-normal text-[#8b8b8b]">saved jobs</h1>
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        <div className="mx-auto mt-9 grid max-w-[820px] gap-7 rounded-md border border-[#d4d4d4] bg-white p-5 shadow-[0_2px_5px_rgba(0,0,0,0.2)] sm:grid-cols-2 sm:p-7">
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} onToggle={() => toggleSaved(job.id)} />
          ))}
        </div>
        {visibleJobs.length === 0 && <p className="mt-6 text-center text-sm text-[#7b8799]">No saved jobs in {activeCategory}.</p>}
      </section>
    </main>
  );
}

function Header({ active }: { active: string }) {
  const links = [
    ["Home", "/home"],
    ["Find jobs", "/job-details"],
    ["cv builder", "/cover-letter"],
    ["Recommendation", "#recommendation"],
    ["Saved", "/saved-jobs"],
  ];
  return (
    <header className="bg-[#0b142b] px-4 py-3 sm:px-8">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between">
        <Link href="/home" aria-label="InternLink home"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white"><Image src="/internlink-logo.png" alt="InternLink" width={40} height={40} className="h-full w-full object-contain" /></span></Link>
        <div className="hidden items-center gap-6 text-[10px] text-white sm:flex">{links.map(([label, href]) => <Link key={label} href={href} className={label === active ? "font-bold text-white" : "text-slate-300 hover:text-white"}>{label}</Link>)}</div>
        <button type="button" className="rounded-full bg-[#ff7417] px-5 py-2 text-[8px] font-semibold uppercase text-white hover:bg-[#e4640e]">Sign out</button>
      </nav>
    </header>
  );
}

function CategoryTabs({ active, onChange }: { active: string; onChange: (category: string) => void }) {
  return <div className="mt-7 flex flex-wrap justify-center gap-3">{categories.map((category) => <button key={category} type="button" onClick={() => onChange(category)} className={`rounded-lg px-5 py-2 text-[10px] shadow-[0_2px_3px_rgba(0,0,0,0.15)] ${active === category ? "bg-[#0b142b] font-semibold text-white" : "bg-white text-[#17233b] hover:bg-[#f4f5f7]"}`}>{category}</button>)}</div>;
}

function JobCard({ job, onToggle }: { job: Job; onToggle: () => void }) {
  return (
    <article className={`relative min-h-[112px] border-b border-[#d9d9d9] border-l-4 border-l-[#ff7417] bg-white px-4 py-4 shadow-[0_2px_3px_rgba(0,0,0,0.12)] ${!job.saved ? "opacity-50" : ""}`}>
      <button type="button" onClick={onToggle} aria-label={job.saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} className="absolute right-3 top-3 text-[#111] hover:text-[#ff7417]"><Heart className="h-3.5 w-3.5" fill={job.saved ? "currentColor" : "none"} /></button>
      <Link href={`/job-details?job=${job.id}`} className="block">
        <h2 className="pr-6 text-[12px] font-normal text-[#17233b]">{job.title}</h2>
        <p className="mt-1 text-[11px]">{job.company} · {job.location}</p>
        <span className="mt-4 inline-block rounded-full bg-[#ffe1cf] px-4 py-1 text-[10px] text-[#ff7417]">{job.match}% match</span>
        <p className="mt-1 text-[8px] text-[#9da4ae]">Posted · {job.age}</p>
      </Link>
    </article>
  );
}
