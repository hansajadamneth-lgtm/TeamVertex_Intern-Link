"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
type Application={_id:string;companyName?:string;position?:string;createdAt:string;fitScore:number;
 status:string;job?:{title?:string};};
export default function ApplicationsPage(){
 const [items,setItems]=useState<Application[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/applications/me",{cache:"no-store"}).then(async r=>{
  const j=await r.json();if(!r.ok||!j.success)throw new Error(j.message||"Unable to load your applications.");
  setItems(j.data||[]);
 }).catch((e:Error)=>setError(e.message)).finally(()=>setLoading(false));},[]);
 return <main className="min-h-screen bg-[#f4f7fa] text-[#17233b]"><header className="bg-[#0b142b] p-5 text-white">
  <nav className="mx-auto flex max-w-5xl justify-between"><Link href="/home" className="font-bold">InternLink</Link>
   <Link href="/job-details" className="text-sm">Find internships</Link></nav></header>
  <section className="mx-auto max-w-5xl px-5 py-10">
   <h1 className="text-3xl font-bold">My applications</h1>
   <p className="mt-2 text-sm text-slate-500">Status updates from employers appear here when your application record changes.</p>
   {loading&&<p className="mt-6">Loading applications...</p>}
   {error&&<p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in</Link></p>}
   {!loading&&!error&&!items.length&&<div className="mt-7 rounded-xl bg-white p-7 text-sm">No applications yet. <Link className="font-semibold text-[#ff7417]" href="/job-details">Find your first internship</Link></div>}
   <div className="mt-7 space-y-3">{items.map(app=><article key={app._id} className="grid gap-3 rounded-xl bg-white p-6 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center">
    <div><h2 className="font-semibold">{app.position||app.job?.title||"Internship"}</h2>
     <p className="mt-1 text-sm text-slate-500">{app.companyName||"Company"} · Applied {new Date(app.createdAt).toLocaleDateString()}</p>
     <p className="mt-2 text-xs text-slate-500">Skill match at application: {app.fitScore}%</p></div>
    <span className="rounded-full bg-orange-50 px-4 py-2 text-center text-sm font-semibold text-orange-700">{app.status}</span>
   </article>)}</div>
  </section></main>;
}
