"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Job = { _id: string; title: string; companyName: string; location: string; status: string; applicationsCount?: number; createdAt: string; category?: string };
export default function InternshipPostsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string>("");
  async function refresh() {
    const r = await fetch("/api/admin/jobs", { cache: "no-store" });
    const j = await r.json();
    if (!r.ok || !j.success) throw new Error(j.message || "Could not load internship posts.");
    setJobs(j.data || []);
  }
  useEffect(() => { refresh().catch(e=>setError(e.message)).finally(()=>setLoading(false)); }, []);
  async function closeJob(id: string) {
    if (!window.confirm("Close this internship? It will no longer be shown to students.")) return;
    setBusy(id); setError(""); setNotice("");
    try {
      const r = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Unable to close internship.");
      await refresh();
      setNotice("Internship closed.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to close internship."); }
    finally { setBusy(""); }
  }
  const filtered = jobs.filter(j=>[j.title,j.companyName,j.location,j.status].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] p-5 text-[#17233b] sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">Internship posts</h1><p className="mt-2 text-sm text-slate-500">Live postings across all companies.</p></div>
      <Link href="/admin/internship-posts/add" className="rounded-xl bg-[#ff7417] px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">+ Add internship</Link>
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {[
        {label:"Total posts",n:jobs.length},
        {label:"Active",n:jobs.filter(j=>j.status==="Active").length},
        {label:"Pending / closed",n:jobs.filter(j=>j.status!=="Active").length},
      ].map(c=><div key={c.label} className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">{c.label}</p><p className="mt-2 text-3xl font-bold">{c.n}</p></div>)}
    </div>
    <input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search internship posts" placeholder="Search title, company, status or location..."
      className="mt-6 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-orange-500"/>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
    <div className="mt-5 overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full min-w-[730px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Internship</th><th className="p-4">Company</th><th className="p-4">Location</th><th className="p-4">Applications</th><th className="p-4">Status</th><th className="p-4">Manage</th></tr></thead>
        <tbody>{filtered.map(j=><tr key={j._id} className="border-t">
          <td className="p-4 font-semibold">{j.title}</td><td className="p-4">{j.companyName}</td><td className="p-4">{j.location}</td>
          <td className="p-4">{j.applicationsCount || 0}</td><td className="p-4">{j.status}</td>
          <td className="p-4">{j.status==="Active" && <button disabled={busy===j._id} onClick={()=>closeJob(j._id)}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50">Close</button>}
            {j.status!=="Active" && <span className="text-xs text-slate-400">Inactive</span>}</td>
        </tr>)}</tbody>
      </table>
      {loading && <p className="p-6 text-sm">Loading posts...</p>}
      {!loading && filtered.length===0 && <p className="p-8 text-center text-sm text-slate-500">No internship posts yet. Create one using a verified company.</p>}
    </div>
  </main>;
}
