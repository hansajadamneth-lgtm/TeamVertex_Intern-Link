"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Search, Star } from "lucide-react";
import { useState } from "react";

const jobs = [
  { id: 1, category: "IT", title: "Frontend engineer", company: "Horizon Labs", location: "Colombo", match: 84 },
  { id: 2, category: "Marketing", title: "Digital marketing intern", company: "Northwind", location: "Remote", match: 90 },
  { id: 3, category: "Finance", title: "Financial analyst intern", company: "Solvex", location: "Kandy", match: 84 },
  { id: 4, category: "Engineering", title: "Systems engineering intern", company: "Apex Technologies", location: "Colombo", match: 84 },
  { id: 5, category: "IT", title: "Cloud solutions intern", company: "LSEG", location: "Colombo", match: 72 },
];

const categories = ["IT", "Marketing", "Finance", "Engineering"];

export default function JobDetailsPage() {
  const [activeCategory, setActiveCategory] = useState("IT");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(3);
  const categoryJobs = jobs.filter((job) => job.category === activeCategory);
  const selected = categoryJobs.find((job) => job.id === selectedId) ?? categoryJobs[0] ?? jobs[0];
  const filteredJobs = categoryJobs.filter((job) => `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#f1f1f1] text-[#111a2e]">
      <Header active="Find jobs" />
      <section className="mx-auto min-h-[calc(100vh-76px)] max-w-[1120px] bg-white px-5 pb-12 pt-6 sm:px-10">
        <h1 className="text-xl font-normal text-[#8b8b8b]">job details</h1>
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        <div className="mx-auto mt-7 grid max-w-[900px] gap-5 lg:grid-cols-[145px_1fr]">
          <aside className="order-2 space-y-3 lg:order-1">
            <label className="flex items-center rounded-lg border border-[#dfe4e9] bg-white px-3 py-2 shadow-sm lg:col-span-2">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job Title, company or Keyword" className="min-w-0 flex-1 text-[9px] outline-none placeholder:text-[#7f8997]" />
              <Search className="h-3 w-3 text-[#7f8997]" />
            </label>
            {filteredJobs.map((job) => <button key={job.id} type="button" onClick={() => setSelectedId(job.id)} className={`w-full border-b border-[#d9d9d9] border-l-4 border-l-[#ff7417] bg-white p-3 text-left shadow-[0_2px_3px_rgba(0,0,0,0.12)] ${selected.id === job.id ? "ring-1 ring-[#ffb07d]" : ""}`}><p className="text-[9px]">{job.title}</p><p className="mt-1 text-[8px]">{job.company} · {job.location}</p><span className="mt-2 inline-block rounded-full bg-[#ffe1cf] px-3 py-1 text-[8px] text-[#ff7417]">{job.match}% match</span><p className="mt-1 text-[7px] text-[#9da4ae]">Posted · 4 days ago</p></button>)}
          </aside>
          <article className="order-1 rounded-lg border border-[#d9dfe5] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.14)] lg:order-2">
            <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-normal">{selected.title}</h2><p className="text-base">{selected.company} · {selected.location}</p></div><button type="button" aria-label={saved ? "Remove saved job" : "Save job"} onClick={() => setSaved(!saved)} className="text-[#ff7417]"><Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} /></button></div>
            <button type="button" onClick={() => window.alert("Application started for this job.")} className="mt-7 w-full rounded-full bg-[#ff7417] py-3 text-sm font-semibold text-white hover:bg-[#e4640e]">Apply on employer site</button>
            <section className="mt-5 bg-[#e9e9e9] p-5"><h3 className="text-center text-sm font-semibold">Pay Details</h3><p className="mt-4 text-sm">$61K – $122K/yr<br />Total pay</p></section>
            <section className="mt-4 bg-[#e9e9e9] p-5"><h3 className="text-center text-sm font-semibold">Qualifications</h3><p className="mt-4 text-sm">Bachelor&apos;s degree or equivalent (computer science, information technology, or related field)<br />Experience with both Object Oriented and Functional Programming approaches<br />Experience with Java, JMS, Angular, Hibernate, Camel, Spring<br />Experience with REST<br />Experience with Web services</p></section>
            <div className="mt-5 flex justify-center gap-2">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`Rate ${value} stars`} onClick={() => setRating(value)} className={value <= rating ? "text-[#ff7417]" : "text-[#d1d1d1]"}><Star className="h-7 w-7" fill="currentColor" /></button>)}</div>
          </article>
        </div>
      </section>
    </main>
  );
}

function Header({ active }: { active: string }) {
  const links = [["Home", "/home"], ["Find jobs", "/job-details"], ["cv builder", "/"], ["Recommendation", "/home#recommendations"], ["Saved", "/saved-jobs"]];
  return <header className="bg-[#0b142b] px-4 py-3 sm:px-8"><nav className="mx-auto flex max-w-[1120px] items-center justify-between"><Link href="/home" aria-label="InternLink home"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white"><Image src="/internlink-logo.png" alt="InternLink" width={40} height={40} className="h-full w-full object-contain" /></span></Link><div className="hidden items-center gap-6 text-[10px] text-white sm:flex">{links.map(([label, href]) => <Link key={label} href={href} className={label === active ? "font-bold text-white" : "text-slate-300 hover:text-white"}>{label}</Link>)}</div><Link href="/login" className="rounded-full bg-[#ff7417] px-5 py-2 text-[8px] font-semibold uppercase text-white hover:bg-[#e4640e]">Sign out</Link></nav></header>;
}

function CategoryTabs({ active, onChange }: { active: string; onChange: (category: string) => void }) {
  return <div className="mt-7 flex flex-wrap justify-center gap-3">{categories.map((category) => <button key={category} type="button" onClick={() => onChange(category)} className={`rounded-lg px-5 py-2 text-[10px] shadow-[0_2px_3px_rgba(0,0,0,0.15)] ${active === category ? "bg-[#0b142b] font-semibold text-white" : "bg-white text-[#17233b] hover:bg-[#f4f5f7]"}`}>{category}</button>)}</div>;
}
