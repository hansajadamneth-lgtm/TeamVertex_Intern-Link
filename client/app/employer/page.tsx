"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { EmployerEditPost, type EditableInternship } from "@/components/employer-edit-post";
import { ArrowRight, BriefcaseBusiness, Building2, ClipboardList, LayoutDashboard, UsersRound } from "lucide-react";

type Company = { _id: string; name: string; industry: string; email: string; status: string; location?: string; website?: string };
type Job = EditableInternship & { companyName: string };
type CvItem = { title?: string; organization?: string; period?: string; details?: string; url?: string };
type CvSnapshot = { name?: string; headline?: string; summary?: string; skills?: string[];
 education?: CvItem[]; experience?: CvItem[]; projects?: CvItem[] };
type Applicant = { _id: string; status: string; fitScore: number; createdAt: string; coverLetter?: string; resumeUrl?: string;
 cvSnapshot?: CvSnapshot; student?: { fullName: string; email: string; education?: string; skills?: string[] } };
type Overview = { company: Company | null; jobs: Job[] };
const emptyCompany = { name: "", industry: "", email: "", location: "", website: "", description: "" };
const emptyJob = { title: "", category: "IT", type: "Full Time", location: "", duration: "3 Months",
  deadline: "", description: "", requirements: "", skills: "" };
const statuses = ["Application sent","Under review","Interview scheduled","Accepted","Rejected"];
type EmployerView = "dashboard" | "company-profile" | "post-internship" | "my-jobs";

function viewFromHash(hash: string): EmployerView {
  if (hash === "#company-profile") return "company-profile";
  if (hash === "#post-internship") return "post-internship";
  if (hash === "#my-jobs") return "my-jobs";
  return "dashboard";
}

export default function EmployerPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [company, setCompany] = useState(emptyCompany);
  const [job, setJob] = useState(emptyJob);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState("");
  const [editingPost, setEditingPost] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [openApplicant,setOpenApplicant]=useState<string>("");
  const [activeView, setActiveView] = useState<EmployerView>("dashboard");

  useEffect(() => {
    const syncView = () => setActiveView(viewFromHash(window.location.hash));
    syncView();
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  function navigateTo(view: EmployerView) {
    setActiveView(view);
    window.history.pushState(null, "", view === "dashboard" ? "/employer" : "/employer#" + view);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
      navigateTo("my-jobs");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to publish."); }
    finally { setBusy(false); }
  }
  function startEditing(post: Job) {
    setEditingPost(post);
    setError("");
    setNotice("");
    navigateTo("my-jobs");
    window.setTimeout(() => {
      document.getElementById("edit-internship")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function finishEditing() {
    await refresh();
    setEditingPost(null);
    setNotice("Internship post updated successfully. Existing applications are unchanged.");
  }

  async function viewApplicants(jobId: string) {
    setSelectedJob(jobId); setOpenApplicant(""); setError(""); setApplicants([]);
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
      <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(125deg,#0b1b3e_0%,#172d57_65%,#264676_100%)] p-7 text-white shadow-[0_24px_55px_-30px_rgba(11,27,62,.55)] sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-orange-200">InternLink · Employer workspace</p>
        <h1 className="relative mt-3 text-3xl font-bold">{{
          dashboard: "Recruitment overview",
          "company-profile": "Your company identity",
          "post-internship": "Create an opportunity",
          "my-jobs": "Manage your internships",
        }[activeView]}</h1>
        <p className="relative mt-2 max-w-2xl text-sm leading-6 text-slate-200">{{
          dashboard: "See your recruitment progress and jump into the next important action.",
          "company-profile": "Present your organization and keep your verification status in view.",
          "post-internship": "Share a new role, skills and requirements with students.",
          "my-jobs": "Edit listings, review candidates and move applications forward.",
        }[activeView]}</p>
        <div className="relative mt-7 flex flex-wrap gap-2" aria-label="Employer workspace sections">
          {([
            ["dashboard", "Dashboard", LayoutDashboard],
            ["company-profile", "Company profile", Building2],
            ["post-internship", "Post internship", BriefcaseBusiness],
            ["my-jobs", "My jobs", ClipboardList],
          ] as const).map(([id, label, Icon]) => (
            <button key={id} type="button" onClick={() => navigateTo(id)}
              aria-pressed={activeView === id}
              className={"inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-orange-300 " +
                (activeView === id ? "border-orange-300/70 bg-orange-500 text-white shadow-lg shadow-orange-900/20" : "border-white/20 bg-white/10 text-slate-100 hover:bg-white/20")}>
              <Icon aria-hidden="true" className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in</Link></p>}
      {notice && <p role="status" className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-800">{notice}</p>}
      {loading && <p className="mt-6 text-sm">Loading employer dashboard...</p>}
      {!loading && overview && <>
        {activeView === "dashboard" && (
          <section aria-label="Recruitment overview" className="mt-7 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {([
                ["Company status", overview.company?.status || "Not registered", Building2, "text-sky-700", "bg-sky-50"],
                ["Published internships", String(overview.jobs.length), BriefcaseBusiness, "text-orange-700", "bg-orange-50"],
                ["Applications received", String(overview.jobs.reduce((total, item) => total + (item.applicationsCount || 0), 0)), UsersRound, "text-emerald-700", "bg-emerald-50"],
              ] as const).map(([label, value, Icon, color, bg]) => (
                <article key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className={"inline-flex h-11 w-11 items-center justify-center rounded-xl " + bg + " " + color}><Icon className="h-5 w-5" aria-hidden="true" /></div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-[#0b1b3e]">{value}</p>
                </article>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">Quick actions</h2>
              <p className="mt-2 text-sm text-slate-500">Choose where you want to work next.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {([
                  ["company-profile", "Company profile", "Review company details and verification.", Building2],
                  ["post-internship", "Post internship", "Publish your next opportunity.", BriefcaseBusiness],
                  ["my-jobs", "My jobs & applicants", "Edit listings and review applications.", ClipboardList],
                ] as const).map(([id, label, description, Icon]) => (
                  <button key={id} type="button" onClick={() => navigateTo(id)}
                    className="group flex min-h-32 flex-col items-start rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50">
                    <Icon className="h-5 w-5 text-orange-600" aria-hidden="true" />
                    <span className="mt-3 font-bold text-slate-900">{label}</span>
                    <span className="mt-1 text-xs leading-5 text-slate-500">{description}</span>
                    <ArrowRight className="mt-3 h-4 w-4 text-orange-700 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
        {activeView === "company-profile" && (!overview.company ? <section id="company-profile" className="scroll-mt-36 mt-7 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
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
          <div id="company-profile" className="scroll-mt-36 mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">{overview.company.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{overview.company.industry} · {overview.company.email}</p>
            <p className="mt-3 text-sm">Verification: <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-700">{overview.company.status}</span></p>
            {overview.company.status!=="Verified" && <p className="mt-3 text-sm text-amber-700">Publishing is disabled until an InternLink admin verifies your company.</p>}
          </div>

        </>)}
        {activeView === "post-internship" && (
          <div>
            {!overview.company && <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-bold text-amber-900">Set up your company first</h2>
              <p className="mt-2 text-sm text-amber-800">You need a verified company profile before publishing internships.</p>
              <button type="button" onClick={() => navigateTo("company-profile")} className="mt-4 rounded-xl bg-[#0b1b3e] px-5 py-2.5 text-sm font-semibold text-white">Open company profile</button>
            </div>}
            {overview.company && overview.company.status !== "Verified" && <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-bold text-amber-900">Verification required</h2>
              <p className="mt-2 text-sm text-amber-800">Your company is currently {overview.company.status}. Posting becomes available after admin verification.</p>
              <button type="button" onClick={() => navigateTo("company-profile")} className="mt-4 rounded-xl bg-[#0b1b3e] px-5 py-2.5 text-sm font-semibold text-white">View verification status</button>
            </div>}
          {overview.company?.status==="Verified" && <section id="post-internship" className="scroll-mt-36 mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
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
          </div>
        )}
        {activeView === "my-jobs" && <section id="my-jobs" className="scroll-mt-36 mt-7 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Your internship posts</h2>
          {overview.jobs.length===0 && <p className="mt-4 text-sm text-slate-500">No internship posts yet.</p>}
          <div className="mt-4 space-y-3">{overview.jobs.map(j=><div key={j._id} className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 text-sm">
            <div><p className="font-semibold">{j.title}</p><p className="text-slate-500">{j.location} · {j.status} · {j.applicationsCount || 0} applications</p></div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={()=>startEditing(j)}
                aria-label={`Edit ${j.title}`}
                className="rounded-xl border border-orange-300 px-4 py-2 font-semibold text-orange-800 hover:bg-orange-50">
                Edit post
              </button>
              <button type="button" onClick={()=>viewApplicants(j._id)} className="rounded-xl border px-4 py-2 font-semibold hover:bg-slate-50">View applicants</button>
            </div>
          </div>)}</div>
        </section>}
        {activeView === "my-jobs" && editingPost && <EmployerEditPost key={editingPost._id} post={editingPost}
          onCancel={()=>setEditingPost(null)} onUpdated={finishEditing}/>}
        {activeView === "my-jobs" && selectedJob && <section className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Applications for selected internship</h2>
          {!applicants.length && <p className="mt-4 text-sm text-slate-500">No applications received yet.</p>}
          {applicants.map(app=><article key={app._id} className="mt-4 border-b pb-5 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
             <div><p className="font-semibold">{app.student?.fullName || "Student"}</p>
              <p>{app.student?.email}</p>
              <p className="text-slate-500">Applied {new Date(app.createdAt).toLocaleDateString()} · {app.fitScore}% skills match</p>
             </div>
             <div className="flex flex-wrap items-center gap-3">
              <button type="button" aria-expanded={openApplicant===app._id} onClick={()=>setOpenApplicant(x=>x===app._id?"":app._id)}
               className="rounded-lg border px-3 py-2 font-semibold">{openApplicant===app._id?"Hide details":"Review submitted CV"}</button>
              <label className="text-xs font-semibold">Status
               <select disabled={busy} value={app.status} onChange={e=>updateApplicant(app._id,e.target.value)}
                className="ml-2 rounded-lg border px-3 py-2 text-sm">{statuses.map(s=><option key={s}>{s}</option>)}</select>
              </label>
             </div>
            </div>
            {openApplicant===app._id&&<div className="mt-4 space-y-4 rounded-xl bg-slate-50 p-5">
              <div><h3 className="font-semibold">Submitted CV: {app.cvSnapshot?.name||"Not available (older application)"}</h3>
               {app.cvSnapshot?.headline&&<p className="mt-1">{app.cvSnapshot.headline}</p>}
               {app.cvSnapshot?.summary&&<p className="mt-2 whitespace-pre-wrap text-slate-600">{app.cvSnapshot.summary}</p>}
               {Boolean(app.cvSnapshot?.skills?.length)&&<p className="mt-2"><strong>Skills:</strong> {app.cvSnapshot?.skills?.join(", ")}</p>}
              </div>
              {(["education","experience","projects"] as const).map(section=>Boolean(app.cvSnapshot?.[section]?.length)&&
               <section key={section}><h4 className="mb-2 font-semibold capitalize">{section}</h4>
                {app.cvSnapshot?.[section]?.map((item,index)=><div key={index} className="mt-2 border-l-2 border-orange-200 pl-3">
                  <p className="font-medium">{item.title} {item.organization&&"· "+item.organization}</p>
                  {item.period&&<p className="text-xs text-slate-500">{item.period}</p>}
                  {item.details&&<p className="mt-1 whitespace-pre-wrap text-slate-600">{item.details}</p>}
                  {item.url&&/^https:\/\//i.test(item.url)&&<a href={item.url} target="_blank" rel="noopener noreferrer" className="text-orange-700 underline">Project link</a>}
                 </div>)}
               </section>)}
              <section><h4 className="font-semibold">Cover letter</h4>
               <p className="mt-2 whitespace-pre-wrap text-slate-600">{app.coverLetter||"No cover letter submitted."}</p>
              </section>
              {app.resumeUrl&&/^https:\/\//i.test(app.resumeUrl)&&<a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-block font-semibold text-orange-700 underline">Open external resume</a>}
            </div>}
          </article>)}
        </section>}
      </>}
    </div>
  </main>;
}
