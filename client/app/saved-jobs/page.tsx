"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookmarkX, Heart, MapPin } from "lucide-react";

type Saved = { _id: string; createdAt: string; job: {
  _id: string; title: string; companyName: string; location: string;
  category: string; type: string; createdAt: string;
} };
const categories = ["All", "IT", "Marketing", "Finance", "Engineering", "Other"];
export default function SavedJobsPage() {
  const [items, setItems] = useState<Saved[]>([]);
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState("");

  useEffect(() => {
    fetch("/api/saved-jobs", { cache: "no-store" })
      .then(async r => { const j = await r.json(); if (!r.ok || !j.success) throw new Error(j.message || "Could not load saved internships."); return j.data as Saved[]; })
      .then(setItems).catch((e: Error) => setError(e.message)).finally(()=>setLoading(false));
  }, []);
  async function remove(jobId: string) {
    setRemoving(jobId); setError(""); setNotice("");
    try {
      const r = await fetch(`/api/saved-jobs/${jobId}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Could not remove internship.");
      setItems(current => current.filter(x=>x.job._id!==jobId));
      setNotice("Internship removed from saved jobs.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not remove internship."); }
    finally { setRemoving(""); }
  }
  const filtered = items.filter(x=>category==="All"||x.job.category===category);
  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] px-5 py-10 text-[#17233b]">
    <section className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Saved internships</h1>
          <p className="mt-2 text-sm text-slate-500">Your bookmarked opportunities are stored securely with your InternLink account.</p></div>
        <Link href="/job-details" className="rounded-xl bg-[#ff7417] px-5 py-3 text-sm font-semibold text-white">Browse internships</Link>
      </div>
      <div className="mt-7 flex flex-wrap gap-2">{categories.map(c=><button type="button" key={c} onClick={()=>setCategory(c)}
        className={`rounded-full px-4 py-2 text-sm font-semibold ${category===c?"bg-[#0b1b3e] text-white":"border bg-white hover:bg-slate-50"}`}>{c}</button>)}</div>
      {loading && <p className="mt-7 text-sm">Loading saved internships...</p>}
      {error && <p role="alert" className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in</Link></p>}
      {notice && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
      {!loading && !error && filtered.length===0 && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <BookmarkX className="mx-auto h-10 w-10 text-slate-400"/>
        <p className="mt-3 font-semibold">No saved internships {category==="All"?"yet":`in ${category}`}.</p>
        <p className="mt-2 text-sm text-slate-500">Use the Save button on a verified internship to add it here.</p>
        <Link href="/job-details" className="mt-5 inline-block text-sm font-bold text-orange-600">Find internships</Link>
      </div>}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">{filtered.map(saved=><article key={saved._id} className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{saved.job.category}</span>
          <button type="button" onClick={()=>remove(saved.job._id)} disabled={removing===saved.job._id}
            aria-label={`Remove ${saved.job.title} from saved jobs`} className="text-orange-600 disabled:opacity-40"><Heart className="h-5 w-5" fill="currentColor"/></button>
        </div>
        <h2 className="mt-4 text-lg font-bold">{saved.job.title}</h2><p className="mt-1 text-sm text-slate-600">{saved.job.companyName}</p>
        <p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><MapPin size={14}/>{saved.job.location} · {saved.job.type}</p>
        <Link href={`/job-details?job=${encodeURIComponent(saved.job._id)}`} className="mt-5 inline-flex rounded-xl bg-[#0b1b3e] px-5 py-3 text-sm font-semibold text-white">View internship</Link>
      </article>)}</div>
    </section>
  </main>;
}
