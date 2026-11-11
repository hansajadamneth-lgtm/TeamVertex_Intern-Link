"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Company = { _id: string; name: string; status: string };
type Form = { title: string; company: string; location: string; type: string; category: string;
  duration: string; deadline: string; description: string; requirements: string; skills: string };
const blank: Form = { title: "", company: "", location: "", type: "Full Time", category: "IT",
  duration: "3 Months", deadline: "", description: "", requirements: "", skills: "" };
export default function AddInternshipPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(blank);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    fetch("/api/admin/companies", { cache: "no-store" }).then(async r => {
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Could not load verified companies.");
      return (j.data as Company[]).filter(c=>c.status==="Verified");
    }).then(setCompanies).catch((e: Error)=>setError(e.message));
  }, []);
  function update<K extends keyof Form>(key: K, value: Form[K]) { setForm(p => ({ ...p, [key]: value })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setSaving(true);
    const selected = companies.find(c => c._id === form.company);
    if (!selected) { setError("Select a verified company first."); setSaving(false); return; }
    try {
      const r = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, companyName: selected.name, skills: form.skills.split(",").map(s=>s.trim()).filter(Boolean),
          deadline: form.deadline || null, status: "Active" }) });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Could not publish internship.");
      setNotice("Internship published successfully.");
      router.push("/admin/internship-posts");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to publish internship."); }
    finally { setSaving(false); }
  }
  const input = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500";
  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] p-5 text-[#17233b] sm:p-8">
    <section className="mx-auto max-w-3xl rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
      <Link href="/admin/internship-posts" className="text-sm font-semibold text-orange-600">← All internships</Link>
      <h1 className="mt-4 text-3xl font-bold">Publish an internship</h1>
      <p className="mt-2 text-sm text-slate-500">Only approved companies can publish verified internships.</p>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
      <form onSubmit={submit} className="mt-7 space-y-5">
        <label className="block text-sm font-semibold">Job title <input required maxLength={150} value={form.title} onChange={e=>update("title",e.target.value)} className={input} /></label>
        <label className="block text-sm font-semibold">Verified company
          <select required value={form.company} onChange={e=>update("company",e.target.value)} className={input}>
            <option value="">Choose a verified company</option>{companies.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </label>
        {companies.length===0 && <p className="text-sm text-amber-700">No verified companies yet. <Link href="/admin/companies" className="underline">Review company registrations</Link> first.</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Location <input required maxLength={120} value={form.location} onChange={e=>update("location",e.target.value)} className={input} /></label>
          <label className="block text-sm font-semibold">Duration <input value={form.duration} onChange={e=>update("duration",e.target.value)} className={input} /></label>
          <label className="block text-sm font-semibold">Internship type <select value={form.type} onChange={e=>update("type",e.target.value)} className={input}>{["Full Time","Part Time","Remote","Hybrid"].map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="block text-sm font-semibold">Category <select value={form.category} onChange={e=>update("category",e.target.value)} className={input}>{["IT","Marketing","Finance","Engineering","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="block text-sm font-semibold">Application deadline <input type="date" min={new Date().toISOString().slice(0,10)} value={form.deadline} onChange={e=>update("deadline",e.target.value)} className={input} /></label>
          <label className="block text-sm font-semibold">Skills (comma-separated) <input value={form.skills} onChange={e=>update("skills",e.target.value)} placeholder="React, Git, JavaScript" className={input}/></label>
        </div>
        <label className="block text-sm font-semibold">Description <textarea required rows={5} value={form.description} onChange={e=>update("description",e.target.value)} className={input} /></label>
        <label className="block text-sm font-semibold">Requirements <textarea rows={4} value={form.requirements} onChange={e=>update("requirements",e.target.value)} className={input} /></label>
        <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving||companies.length===0} className="rounded-xl bg-[#ff7417] px-6 py-3 font-bold text-white disabled:opacity-60">{saving?"Publishing...":"Publish internship"}</button>
          <Link href="/admin/internship-posts" className="rounded-xl border px-6 py-3 font-semibold">Cancel</Link></div>
      </form>
    </section>
  </main>;
}
