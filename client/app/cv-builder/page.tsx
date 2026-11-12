"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Plus, Save, Trash2, Sparkles } from "lucide-react";

type Entry = { title: string; organization: string; period: string; details: string; url: string };
type Cv = { _id?: string; name: string; headline: string; summary: string; skills: string[];
 education: Entry[]; experience: Entry[]; projects: Entry[]; isPrimary: boolean; };
type SectionKey = "education" | "experience" | "projects";
const newEntry = (): Entry => ({ title: "", organization: "", period: "", details: "", url: "" });
const blank = (): Cv => ({ name: "My CV", headline: "", summary: "", skills: [],
 education: [], experience: [], projects: [], isPrimary: true });
const sections: { key: SectionKey; title: string; hint: string }[] = [
 { key: "education", title: "Education", hint: "Qualification / University" },
 { key: "experience", title: "Work experience", hint: "Role / Employer" },
 { key: "projects", title: "Projects", hint: "Project / Technologies" },
];
export default function CvBuilder() {
 const [cvs, setCvs] = useState<Cv[]>([]);
 const [cv, setCv] = useState<Cv>(blank());
 const [skillText, setSkillText] = useState("");
 const [busy, setBusy] = useState(false);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [notice, setNotice] = useState("");
 const select = (next: Cv) => { setCv({ ...next, education: [...next.education], experience: [...next.experience], projects: [...next.projects] }); setSkillText(next.skills.join(", ")); setError(""); setNotice(""); };
 const refresh = async (selectedId?: string) => {
   const res = await fetch("/api/cvs", { cache: "no-store" }); const json = await res.json();
   if (!res.ok || !json.success) throw new Error(json.message || "Unable to load CVs. Please sign in.");
   const list: Cv[] = json.data || []; setCvs(list);
   if (selectedId) { const next = list.find((item) => item._id === selectedId); if (next) select(next); }
   else if (list.length) select(list[0]);
   else select(blank());
   return list;
 };
 useEffect(() => { refresh().catch((e: Error) => setError(e.message)).finally(() => setLoading(false)); }, []);
 const update = (key: keyof Cv, value: string | boolean) => setCv((prev) => ({ ...prev, [key]: value }));
 const updateEntry = (key: SectionKey, index: number, field: keyof Entry, value: string) =>
   setCv((prev) => ({ ...prev, [key]: prev[key].map((entry, i) => i === index ? { ...entry, [field]: value } : entry) }));
 const addEntry = (key: SectionKey) => setCv((prev) => ({ ...prev, [key]: [...prev[key], newEntry()] }));
 const removeEntry = (key: SectionKey, index: number) => setCv((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
 const newVersion = () => select({ ...blank(), name: "New CV version", isPrimary: cvs.length === 0 });
 const duplicate = () => select({ ...cv, _id: undefined, name: cv.name + " (copy)", isPrimary: false });
 const save = async () => {
   setBusy(true); setError(""); setNotice("");
   try {
     const payload = { ...cv, skills: skillText.split(",").map((s) => s.trim()).filter(Boolean) };
     const res = await fetch(cv._id ? "/api/cvs/" + cv._id : "/api/cvs", {
       method: cv._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
     });
     const json = await res.json();
     if (!res.ok || !json.success) throw new Error(json.message || "Unable to save CV.");
     await refresh(json.data._id); setNotice("CV saved successfully.");
   } catch (e) { setError(e instanceof Error ? e.message : "Save failed."); }
   finally { setBusy(false); }
 };
 const remove = async () => {
   if (!cv._id || !window.confirm("Delete this CV version?")) return;
   setBusy(true); setError("");
   try { const res = await fetch("/api/cvs/" + cv._id, { method: "DELETE" }); const j = await res.json();
     if (!res.ok || !j.success) throw new Error(j.message || "Delete failed.");
     const list = await refresh(); if (!list.length) select(blank()); setNotice("CV deleted.");
   } catch (e) { setError(e instanceof Error ? e.message : "Delete failed."); }
   finally { setBusy(false); }
 };
 async function importTextCV(event: React.ChangeEvent<HTMLInputElement>) {
   const file = event.target.files?.[0];
   if (!file) return;
   setError(""); setNotice("");
   if (!/\.(txt|md)$/i.test(file.name) || file.size > 50000) {
     setError("Import a plain-text .txt or .md CV smaller than 50 KB. PDF and LinkedIn imports are not yet supported.");
     event.target.value = "";
     return;
   }
   try {
     const content = (await file.text()).trim();
     if (!content) throw new Error("The selected CV file is empty.");
     setCv(previous => ({ ...previous, summary: content.slice(0, 3000) }));
     setNotice("Text CV imported into Profile summary. Review and structure your skills, experience and education before saving.");
   } catch (err) { setError(err instanceof Error ? err.message : "Could not read text CV."); }
   event.target.value = "";
 }
 const field = (label: string, value: string, onChange: (s: string) => void, multiline = false) =>
   <label className="block space-y-1.5"><span className="text-xs font-semibold text-slate-600">{label}</span>
     {multiline ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" /> :
       <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" />}
   </label>;
 return <main className="il-page-enter min-h-screen bg-[#f6f8fc] text-[#17233b]">
   <header className="bg-[#0b142b] px-6 py-4 text-white"><div className="mx-auto flex max-w-6xl items-center justify-between">
     <Link href="/home" className="flex items-center gap-2 text-sm"><ArrowLeft size={16}/> InternLink</Link>
     <nav className="flex gap-4 text-sm"><Link href="/profile">Profile</Link><Link href="/recommendations">Matches</Link></nav>
   </div></header>
   <div className="mx-auto max-w-6xl px-5 py-10">
     <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
       <div><h1 className="text-3xl font-bold">CV Builder</h1><p className="mt-2 text-sm text-slate-500">Save multiple CV versions and choose one for internship matching.</p></div>
       <div className="flex gap-2"><button onClick={newVersion} className="rounded-xl border bg-white px-4 py-2 text-sm"><Plus size={15} className="mr-1 inline"/>New version</button>
         <button onClick={duplicate} className="rounded-xl border bg-white px-4 py-2 text-sm">Duplicate</button></div>
     </div>
     {loading && <p role="status">Loading CV versions...</p>}
     {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in</Link></p>}
     {notice && <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
     <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
       <div className="space-y-5 print:hidden">
         {cvs.length > 0 && <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
           <label className="text-xs font-semibold text-slate-500">Saved versions</label>
           <select value={cv._id || ""} onChange={(e) => {const selected = cvs.find((x) => x._id === e.target.value); if (selected) select(selected);}}
             className="mt-2 w-full rounded-xl border p-3 text-sm">
             {!cv._id && <option value="">Unsaved version</option>}
             {cvs.map((version) => <option key={version._id} value={version._id}>{version.name}{version.isPrimary ? " (primary)" : ""}</option>)}
           </select>
         </div>}
         <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
           <h2 className="text-lg font-semibold">About you</h2>
           <label className="block rounded-xl border border-dashed border-orange-200 bg-orange-50/50 p-4 text-xs text-slate-700">
             <span className="font-semibold">Import an existing text CV (.txt or .md, optional)</span>
             <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={importTextCV}
               className="mt-2 block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-2 file:font-semibold file:text-orange-800" />
             <span className="mt-2 block text-slate-500">Imported text fills your summary; review and move details into skills, education, projects and experience. PDF and LinkedIn import are not yet supported.</span>
           </label>
           {field("CV version name", cv.name, (v) => update("name", v))}
           {field("Professional headline", cv.headline, (v) => update("headline", v))}
           {field("Profile summary", cv.summary, (v) => update("summary", v), true)}
           {field("Skills (comma separated)", skillText, setSkillText, true)}
           <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cv.isPrimary}
             disabled={Boolean(cv._id && cv.isPrimary)}
             onChange={(e) => update("isPrimary", e.target.checked)} />
             Use as my primary CV for recommendations</label>
           {cv._id && cv.isPrimary && <p className="text-xs text-slate-500">A primary CV is required for matching. To change it, select another version and make that one primary.</p>}
         </section>
         {sections.map((section) => <section key={section.key} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
           <div className="mb-4 flex items-center justify-between">
             <h2 className="text-lg font-semibold">{section.title}</h2>
             <button onClick={() => addEntry(section.key)} className="rounded-xl border px-3 py-2 text-xs"><Plus size={13} className="mr-1 inline"/>Add</button>
           </div>
           {cv[section.key].length === 0 && <p className="text-sm text-slate-400">No entries yet.</p>}
           {cv[section.key].map((entry, index) => <div key={index} className="mb-4 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
             {field(section.hint, entry.title, (v) => updateEntry(section.key, index, "title", v))}
             {field("Institution / Company", entry.organization, (v) => updateEntry(section.key, index, "organization", v))}
             {field("Dates", entry.period, (v) => updateEntry(section.key, index, "period", v))}
             {field("Description", entry.details, (v) => updateEntry(section.key, index, "details", v), true)}
             {section.key === "projects" && field("Project URL", entry.url, (v) => updateEntry(section.key, index, "url", v))}
             <button onClick={() => removeEntry(section.key, index)} className="text-xs text-red-600"><Trash2 size={13} className="mr-1 inline"/>Remove entry</button>
           </div>)}
         </section>)}
         <div className="flex flex-wrap gap-2">
           <button disabled={busy} onClick={save} className="rounded-xl bg-[#ff7417] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><Save size={15} className="mr-2 inline"/>{busy ? "Saving..." : "Save CV"}</button>
           {cv._id && <button disabled={busy} onClick={remove} className="rounded-xl border border-red-200 px-4 py-3 text-sm text-red-600">Delete version</button>}
           <button onClick={() => window.print()} className="rounded-xl border bg-white px-4 py-3 text-sm"><Download size={15} className="mr-2 inline"/>Print / Save PDF</button>
         </div>
       </div>
       <section className="self-start rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)] print:col-span-2 print:shadow-none">
         <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase text-[#ff7417] print:hidden"><Sparkles size={15}/>Live CV preview</p>
         <h2 className="text-2xl font-bold">{cv.headline || "Your professional headline"}</h2>
         <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{cv.summary || "Write a short profile summary to get started."}</p>
         {skillText && <section className="mt-6"><h3 className="mb-2 border-b pb-1 font-bold">Skills</h3><p className="text-sm">{skillText}</p></section>}
         {sections.map((section) => cv[section.key].length > 0 && <section key={section.key} className="mt-6">
           <h3 className="mb-3 border-b pb-1 font-bold">{section.title}</h3>
           {cv[section.key].map((entry, index) => <article key={index} className="mb-4">
             <p className="font-semibold">{entry.title}</p><p className="text-xs text-slate-500">{entry.organization} {entry.period && "· " + entry.period}</p>
             <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{entry.details}</p>
             {entry.url && <p className="text-xs text-[#ff7417]">{entry.url}</p>}
           </article>)}
         </section>)}
       </section>
     </div>
   </div>
 </main>;
}
