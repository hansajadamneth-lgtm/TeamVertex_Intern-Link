"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
type Job = { _id: string; title: string; companyName: string; location: string; skills: string[];
 match: number; matchedSkills: string[]; missingSkills: string[]; matchReason: string; type: string };
export default function RecommendationsPage() {
 const [jobs,setJobs]=useState<Job[]>([]),[loading,setLoading]=useState(true);
 const [error,setError]=useState(""),[profileComplete,setProfileComplete]=useState(false);
 useEffect(()=>{fetch("/api/recommendations",{cache:"no-store"}).then(async(r)=>{
   const j=await r.json();if(!r.ok||!j.success)throw new Error(j.message||"Unable to load recommendations.");
   setJobs(j.data||[]);setProfileComplete(Boolean(j.profileComplete));
 }).catch((e:Error)=>setError(e.message)).finally(()=>setLoading(false));},[]);
 return <main className="il-page-enter min-h-screen bg-[#f6f8fc] text-[#17233b]">
   <header className="bg-[#0b142b] px-5 py-4 text-white"><nav className="mx-auto flex max-w-6xl items-center justify-between">
     <Link href="/home" className="font-bold">InternLink</Link><div className="flex gap-5 text-sm"><Link href="/cv-builder">CV Builder</Link><Link href="/applications">Applications</Link><Link href="/notifications">Notifications</Link></div>
   </nav></header>
   <section className="mx-auto max-w-6xl px-5 py-10">
     <div className="flex items-center gap-3"><Sparkles className="text-[#ff7417]"/><h1 className="text-3xl font-bold">Recommended for you</h1></div>
     <p className="mt-2 text-sm text-slate-500">Real verified internship listings ranked using your primary CV skills. The score is an explainable skills comparison, not an AI hiring decision.</p>
     {loading && <p className="mt-8">Loading recommendations...</p>}
     {error && <p role="alert" className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <Link className="underline" href="/login">Sign in</Link></p>}
     {!loading && !error && !profileComplete && <div className="mt-6 rounded-xl bg-orange-50 p-5 text-sm">Add skills to your CV for useful matches. <Link href="/cv-builder" className="font-bold underline">Build your CV</Link></div>}
     {!loading && !error && !jobs.length && <p className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 text-sm">No verified active internships available yet. Check back after employers are approved and post positions.</p>}
     <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
       {jobs.map((job)=><Card key={job._id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
         <div className="flex items-center justify-between"><span className="rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-[#ff7417]">Skill match</span>
           <span className="text-xl font-bold text-[#ff7417]">{job.match}%</span></div>
         <h2 className="mt-5 text-lg font-semibold">{job.title}</h2>
         <p className="mt-1 text-sm text-slate-500">{job.companyName} · {job.location} · {job.type}</p>
         <p className="mt-4 text-xs text-slate-600">{job.matchReason}</p>
         <div className="mt-3 flex flex-wrap gap-1">{job.matchedSkills.map((s)=><span key={s} className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">{s}</span>)}
           {job.missingSkills.map((s)=><span key={s} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{s} to learn</span>)}</div>
         <Link href={"/job-details?job="+encodeURIComponent(job._id)} className="mt-6 block rounded-full bg-[#0b142b] py-3 text-center text-sm font-semibold text-white">View internship</Link>
       </Card>)}
     </div>
   </section>
 </main>;
}
