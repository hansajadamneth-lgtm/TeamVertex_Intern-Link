"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Company = { _id: string; name: string; industry: string; email: string; status: string; location?: string; website?: string };
type Job = { _id: string; title: string; status: string; companyName: string; location: string; applicationsCount: number };
type Applicant = { _id: string; status: string; fitScore: number; createdAt: string;
  student?: { fullName: string; email: string; education?: string; skills?: string[] } };
type Overview = { company: Company | null; jobs: Job[] };
const emptyCompany = { name: "", industry: "", email: "", location: "", website: "", description: "" };
const emptyJob = { title: "", category: "IT", type: "Full Time", location: "", duration: "3 Months",
  deadline: "", description: "", requirements: "", skills: "" };
const statuses = ["Application sent","Under review","Interview scheduled","Accepted","Rejected"];

export default function EmployerPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [company, setCompany] = useState(emptyCompany);
  const [job, setJob] = useState(emptyJob);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  const refresh = useCallback(async () => {
    const r = await fetch("/api/employer/overview", { cache: "no-store" });
    const j = await r.json();
    if (!r.ok || !j.success) throw new Error(j.message || "Employer dashboard unavailable.");
    setOverview(j.data);
  }, []);
  useEffect(() => { refresh().catch((e: Error) => setError(e.message)).finally(()=>setLoading(false)); }, [refresh]);

  async function registerCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const r = await fetch("/api/companies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(company) });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Company registration failed.");
      setNotice("Company submitted for admin verification.");
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Registration failed."); }
    finally { setBusy(false); }
  }
  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const r = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...job, companyName: overview?.company?.name,
          deadline: job.deadline || null, skills: job.skills.split(",").map(s=>s.trim()).filter(Boolean), status: "Active" }) });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Unable to publish internship.");
      setNotice("Internship published and available to students.");
      setJob(emptyJob);
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to publish."); }
    finally { setBusy(false); }
  }
  async function viewApplicants(jobId: string) {
    setSelectedJob(jobId); setError(""); setApplicants([]);
    try {
      const r = await fetch(`/api/applications/job/${jobId}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Unable to load applicants.");
      setApplicants(j.data || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load applicants."); }
  }
  async function updateApplicant(id: string, status: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      const r = await fetch(`/api/applications/${id}/status`, { method: "PATCH",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Unable to update applicant.");
      setNotice("Application status updated.");
      await viewApplicants(selectedJob);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update application."); }
    finally { setBusy(false); }
  }
  const input = "mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500";
  const updateCompany = (key: keyof typeof emptyCompany, value: string) => setCompany(c=>({...c,[key]:value}));
  const updateJob = (key: keyof typeof emptyJob, value: string) => setJob(c=>({...c,[key]:value}));

  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] px-4 py-10 text-[#17233b] sm:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="rounded-3xl bg-[#0b1b3e] p-7 text-white sm:p-10">
        <p className="text-sm font-semibold text-orange-200">InternLink · Employer portal</p>
        <h1 className="mt-3 text-3xl font-bold">Find your next intern</h1>
        <p className="mt-2 text-sm text-slate-300">Register your company, publish verified internships and track applications in one place.</p>
      </div>
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in</Link></p>}
      {notice && <p role="status" className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-800">{notice}</p>}
      {loading && <p className="mt-6 text-sm">Loading employer dashboard...</p>}
      {!loading && overview && <>
        {!overview.company ? <section className="mt-7 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Register your company</h2>
          <p className="mt-2 text-sm text-slate-500">An admin must verify the company before internships become public.</p>
          <form onSubmit={registerCompany} className="mt-6 grid gap-4 sm:grid-cols-2">
            {(["name","industry","email","location","website"] as const).map(key=><label key={key} className="text-sm font-semibold capitalize">{key}
              <input type={key==="email"?"email":"text"} required={["name","industry","email"].includes(key)} maxLength={120}
                value={company[key]} onChange={e=>updateCompany(key,e.target.value)} className={input}/></label>)}
            <label className="text-sm font-semibold sm:col-span-2">About the company
              <textarea value={company.description} onChange={e=>updateCompany("description",e.target.value)} rows={3} className={input}/></label>
            <button type="submit" disabled={busy} className="rounded-xl bg-[#ff7417] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">Submit for verification</button>
          </form>
        </section> : <>
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">{overview.company.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{overview.company.industry} · {overview.company.email}</p>
            <p className="mt-3 text-sm">Verification: <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-700">{overview.company.status}</span></p>
            {overview.company.status!=="Verified" && <p className="mt-3 text-sm text-amber-700">Publishing is disabled until an InternLink admin verifies your company.</p>}
          </div>
          {overview.company.status==="Verified" && <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold">Post a new internship</h2>
            <form onSubmit={publish} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">Job title<input required maxLength={150} value={job.title} onChange={e=>updateJob("title",e.target.value)} className={input}/></label>
              <label className="text-sm font-semibold">Location<input required value={job.location} onChange={e=>updateJob("location",e.target.value)} className={input}/></label>
              <label className="text-sm font-semibold">Category<select value={job.category} onChange={e=>updateJob("category",e.target.value)} className={input}>{["IT","Marketing","Finance","Engineering","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
              <label className="text-sm font-semibold">Type<select value={job.type} onChange={e=>updateJob("type",e.target.value)} className={input}>{["Full Time","Part Time","Remote","Hybrid"].map(x=><option key={x}>{x}</option>)}</select></label>
              <label className="text-sm font-semibold">Duration<input value={job.duration} onChange={e=>updateJob("duration",e.target.value)} className={input}/></label>
              <label className="text-sm font-semibold">Deadline<input type="date" min={new Date().toISOString().slice(0,10)} value={job.deadline} onChange={e=>updateJob("deadline",e.target.value)} className={input}/></label>
              <label className="text-sm font-semibold sm:col-span-2">Skills (comma-separated)<input value={job.skills} onChange={e=>updateJob("skills",e.target.value)} placeholder="React, Git, SQL" className={input}/></label>
              <label className="text-sm font-semibold sm:col-span-2">Description<textarea required value={job.description} onChange={e=>updateJob("description",e.target.value)} rows={4} className={input}/></label>
              <label className="text-sm font-semibold sm:col-span-2">Requirements<textarea value={job.requirements} onChange={e=>updateJob("requirements",e.target.value)} rows={3} className={input}/></label>
              <button disabled={busy} className="rounded-xl bg-[#ff7417] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{busy?"Publishing...":"Publish internship"}</button>
            </form>
          </section>}
        </>}
        <section className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Your internship posts</h2>
          {overview.jobs.length===0 && <p className="mt-4 text-sm text-slate-500">No internship posts yet.</p>}
          <div className="mt-4 space-y-3">{overview.jobs.map(j=><div key={j._id} className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 text-sm">
            <div><p className="font-semibold">{j.title}</p><p className="text-slate-500">{j.location} · {j.status} · {j.applicationsCount || 0} applications</p></div>
            <button type="button" onClick={()=>viewApplicants(j._id)} className="rounded-xl border px-4 py-2 font-semibold hover:bg-slate-50">View applicants</button>
          </div>)}</div>
        </section>
        {selectedJob && <section className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Applications for selected internship</h2>
          {!applicants.length && <p className="mt-4 text-sm text-slate-500">No applications received yet.</p>}
          {applicants.map(app=><div key={app._id} className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b pb-4 text-sm">
            <div><p className="font-semibold">{app.student?.fullName || "Student"}</p><p>{app.student?.email}</p><p className="text-slate-500">{app.student?.education} · {app.fitScore}% skills match</p></div>
            <label className="text-xs font-semibold">Application status
              <select disabled={busy} value={app.status} onChange={e=>updateApplicant(app._id,e.target.value)}
                className="ml-2 rounded-lg border px-3 py-2 text-sm">{statuses.map(s=><option key={s}>{s}</option>)}</select>
            </label>
          </div>)}
        </section>}
      </>}
    </div>
  </main>;
}
