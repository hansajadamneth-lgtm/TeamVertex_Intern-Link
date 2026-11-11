"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, MapPin, ArrowRight, CheckCircle2, Heart } from "lucide-react";
type Job = { _id: string; title: string; companyName: string; location: string; category: string;
 type: string; duration: string; description: string; requirements: string; skills: string[];
 deadline?: string; salary?: string };
const categories=["All","IT","Marketing","Finance","Engineering","Other"];
export default function JobsPage() {
 const [jobs,setJobs]=useState<Job[]>([]);
 const [selected,setSelected]=useState<string>("");
 const [search,setSearch]=useState(""),[category,setCategory]=useState("All");
 const [loading,setLoading]=useState(true),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const [applying,setApplying]=useState(false);
 const [saved,setSaved]=useState<string[]>([]);
 const [savingJob,setSavingJob]=useState(false);
 useEffect(()=>{
  const run=async()=>{
   try{const r=await fetch("/api/jobs?limit=50",{cache:"no-store"}),j=await r.json();
    if(!r.ok||!j.success)throw new Error(j.message||"Could not load internships.");
    const list:Job[]=j.data||[];setJobs(list);
    const params=new URLSearchParams(window.location.search);
    const target=params.get("job");
    setSearch(params.get("query")||"");
    setSelected(list.find(x=>x._id===target)?target||"":list[0]?._id||"");
   }catch(e){setError(e instanceof Error?e.message:"Unable to load jobs.");}
   finally{setLoading(false);}
  };run();
  fetch("/api/saved-jobs",{cache:"no-store"}).then(async r=>r.ok?r.json():null)
    .then(j=>{if(j?.success)setSaved((j.data||[]).map((x:{job?:{_id?:string}})=>x.job?._id).filter((id: string | undefined): id is string => Boolean(id)));})
    .catch(()=>{});
 },[]);
 const filtered=jobs.filter(j=>(category==="All"||j.category===category)&&
  [j.title,j.companyName,j.location,...(j.skills||[])].join(" ").toLowerCase().includes(search.toLowerCase()));
 const job=filtered.find(j=>j._id===selected)||filtered[0];
 const toggleSave=async()=>{
  if(!job)return;setSavingJob(true);setError("");setNotice("");
  const isSaved=saved.includes(job._id);
  try{
   const r=await fetch(isSaved?"/api/saved-jobs/"+encodeURIComponent(job._id):"/api/saved-jobs",{
    method:isSaved?"DELETE":"POST",...(isSaved?{}:{headers:{"Content-Type":"application/json"},body:JSON.stringify({jobId:job._id})}),
   });
   const j=await r.json();
   if(!r.ok||!j.success)throw new Error(j.message||"Could not update saved internships.");
   setSaved(current=>isSaved?current.filter(id=>id!==job._id):[...current,job._id]);
   setNotice(isSaved?"Removed from saved internships.":"Saved! View it in Saved Jobs.");
  }catch(e){setError((e instanceof Error?e.message:"Unable to save.")+" Sign in as a student if needed.");}
  finally{setSavingJob(false);}
 };
 const apply=async()=>{
  if(!job)return;setApplying(true);setError("");setNotice("");
  try{
   const r=await fetch("/api/applications",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({jobId:job._id})});const result=await r.json();
   if(!r.ok||!result.success)throw new Error(result.message||"Application failed.");
   setNotice("Application submitted! Track progress in My Applications.");
  }catch(e){setError((e instanceof Error?e.message:"Application failed.")+" Sign in as a student if necessary.");}
  finally{setApplying(false);}
 };
 return <main className="il-page-enter min-h-screen bg-[#f6f8fc] text-[#17233b]">
  <header className="bg-[#0b142b] px-5 py-4 text-white"><nav className="mx-auto flex max-w-6xl items-center justify-between">
   <Link href="/home" className="font-semibold">InternLink</Link><div className="flex gap-4 text-sm">
    <Link href="/cv-builder">CV Builder</Link><Link href="/recommendations">Matches</Link><Link href="/applications">Applications</Link>
   </div></nav></header>
  <section className="mx-auto max-w-6xl px-5 py-9"><h1 className="text-3xl font-bold">Discover internships</h1>
   <p className="mt-2 text-sm text-slate-500">Browse active opportunities from verified employers. Apply without leaving InternLink.</p>
   <div className="mt-7 flex flex-wrap gap-3">
    <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]"><Search size={16}/>
      <input aria-label="Search internships" className="w-full outline-none" placeholder="Job title, skills or company" value={search} onChange={e=>setSearch(e.target.value)}/></label>
    <select aria-label="Job category" value={category} onChange={e=>setCategory(e.target.value)} className="rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
     {categories.map(c=><option key={c}>{c}</option>)}
    </select></div>
   {error&&<p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
   {notice&&<p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
   {loading&&<p className="mt-7">Loading verified internships...</p>}
   {!loading&&!filtered.length&&<p className="mt-7 rounded-2xl border border-slate-100 bg-white p-6">No verified internships match your search.</p>}
   <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.3fr)]">
    <div className="space-y-3">{filtered.map(j=><button type="button" key={j._id} onClick={()=>{setSelected(j._id);setNotice("");}}
      className={"w-full rounded-xl border bg-white p-5 text-left shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)] "+(job?._id===j._id?"border-[#ff7417]":"border-slate-200")}>
      <span className="text-xs font-semibold uppercase text-[#ff7417]">{j.category}</span><h2 className="mt-2 font-semibold">{j.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{j.companyName}</p>
      <p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13}/>{j.location} · {j.type}</p>
     </button>)}</div>
    {job&&<Card className="self-start rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
     <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"><CheckCircle2 size={13}/>Verified employer</span>
     <h2 className="mt-4 text-2xl font-bold">{job.title}</h2><p className="mt-1 text-slate-500">{job.companyName} · {job.location}</p>
     <p className="mt-2 text-sm text-slate-500">{job.type} · {job.duration||"Duration not specified"}</p>
     {job.salary&&<p className="mt-3 text-sm">Compensation: {job.salary}</p>}
     {job.deadline&&<p className="mt-2 text-sm">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>}
     <button disabled={applying} onClick={apply} className="mt-6 w-full rounded-xl bg-[#ff7417] py-3 font-semibold text-white disabled:opacity-50">
       {applying?"Submitting...":"Apply for this internship"} <ArrowRight size={16} className="ml-2 inline"/></button>
     <button type="button" disabled={savingJob} onClick={toggleSave} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-50 disabled:opacity-50">
       <Heart size={17} fill={saved.includes(job._id)?"currentColor":"none"}/>
       {savingJob?"Updating...":saved.includes(job._id)?"Remove from saved jobs":"Save internship"}
     </button>
     <h3 className="mt-7 border-b pb-2 text-lg font-semibold">Description</h3>
     <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{job.description}</p>
     <h3 className="mt-6 border-b pb-2 text-lg font-semibold">Requirements</h3>
     <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{job.requirements||"No additional requirements listed."}</p>
     <div className="mt-4 flex flex-wrap gap-2">{(job.skills||[]).map(s=><span key={s} className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-700">{s}</span>)}</div>
    </Card>}
   </div>
  </section>
 </main>;
}
