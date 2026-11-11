"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
type Application={_id:string;companyName?:string;position?:string;createdAt:string;fitScore:number;
 status:string;job?:{title?:string};};
export default function ApplicationsPage(){
 const [items,setItems]=useState<Application[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 const [refreshing, setRefreshing] = useState(false);
 const loadApplications = useCallback(async () => {
   const response = await fetch("/api/applications/me", { cache: "no-store" });
   const payload = await response.json();
   if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to load your applications.");
   setItems(payload.data || []);
   setError("");
 }, []);
 useEffect(() => { loadApplications().catch((e: Error) => setError(e.message)).finally(() => setLoading(false)); }, [loadApplications]);
 async function refresh() {
   setRefreshing(true);
   try { await loadApplications(); }
   catch(e) { setError(e instanceof Error ? e.message : "Unable to refresh applications."); }
   finally { setRefreshing(false); }
 }
 return <main className="il-page-enter min-h-screen bg-[#f6f8fc] text-[#17233b]"><header className="bg-[#0b142b] p-5 text-white">
  <nav className="mx-auto flex max-w-5xl justify-between"><Link href="/home" className="font-bold">InternLink</Link>
   <Link href="/job-details" className="text-sm">Find internships</Link></nav></header>
  <section className="mx-auto max-w-5xl px-5 py-10">
   <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-bold">My applications</h1>
   <button type="button" onClick={refresh} disabled={refreshing || loading} className="rounded-xl border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-50 disabled:opacity-50">{refreshing ? "Refreshing..." : "Refresh statuses"}</button></div>
   <p className="mt-2 text-sm text-slate-500">Status updates from employers appear here when your application record changes.</p>
   {loading&&<p className="mt-6">Loading applications...</p>}
   {error&&<p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in</Link></p>}
   {!loading&&!error&&!items.length&&<div className="mt-7 rounded-2xl border border-slate-100 bg-white p-7 text-sm">No applications yet. <Link className="font-semibold text-[#ff7417]" href="/job-details">Find your first internship</Link></div>}
   <div className="mt-7 space-y-3">{items.map(app=><Card key={app._id} className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)] sm:grid-cols-[1fr_auto] sm:items-center">
    <div><h2 className="font-semibold">{app.position||app.job?.title||"Internship"}</h2>
     <p className="mt-1 text-sm text-slate-500">{app.companyName||"Company"} · Applied {new Date(app.createdAt).toLocaleDateString()}</p>
     <p className="mt-2 text-xs text-slate-500">Skill match at application: {app.fitScore}%</p></div>
    <span className="rounded-full bg-orange-50 px-4 py-2 text-center text-sm font-semibold text-orange-700">{app.status}</span>
   </Card>)}</div>
  </section></main>;
}
