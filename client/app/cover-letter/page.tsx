"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Copy, FileText, Printer, Sparkles } from "lucide-react";

type Draft = {
  jobTitle: string;
  company: string;
  requirements: string;
  background: string;
  tone: "professional" | "enthusiastic" | "concise";
};
const initial: Draft = { jobTitle: "", company: "", requirements: "", background: "", tone: "enthusiastic" };

function createLetter(form: Draft, name: string): string {
  const title = form.jobTitle.trim();
  const company = form.company.trim();
  const skills = form.background.trim().replace(/\s+/g, " ");
  const requirements = form.requirements.trim().replace(/\s+/g, " ");
  const intro = form.tone === "professional"
    ? `I am writing to apply for the ${title} internship at ${company}.`
    : form.tone === "concise"
      ? `I would like to apply for the ${title} internship at ${company}.`
      : `I am excited to apply for the ${title} internship at ${company} and contribute while developing my professional skills.`;
  const background = skills
    ? `My background and experience include ${skills}. I would welcome the opportunity to use these skills in a real-world team environment.`
    : "I am eager to apply what I have learned through my studies and projects in a professional environment.";
  const alignment = requirements
    ? `I understand that the role calls for ${requirements}. I look forward to demonstrating how my experience and willingness to learn align with these expectations.`
    : "I am keen to learn from your team, collaborate responsibly, and contribute to meaningful internship projects.";
  return `Dear Hiring Manager,\n\n${intro}\n\n${background}\n\n${alignment}\n\nThank you for considering my application. I would welcome an opportunity to discuss how I could contribute to your team.\n\nSincerely,\n${name.trim() || "Your name"}`;
}

export default function CoverLetterPage() {
  const [form, setForm] = useState<Draft>(initial);
  const [name, setName] = useState("");
  const [letter, setLetter] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async response => response.ok ? response.json() : null)
      .then(data => { if (active && data?.success) setName(data.user?.fullName || ""); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const change = (key: keyof Draft, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
    setLetter("");
    setNotice("");
    setCopied(false);
  };
  const fieldStyle = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
  async function copyLetter() {
    if (!letter) return;
    try { await navigator.clipboard.writeText(letter); setCopied(true); setNotice("Letter copied to clipboard."); }
    catch { setNotice("Copy is unavailable in this browser. Select the text to copy it manually."); }
  }
  function printLetter() {
    if (letter) window.print();
  }
  return (
    <main className="il-page-enter min-h-screen bg-[#f6f8fc] px-4 py-10 text-[#17233b] sm:px-8">
      <section className="mx-auto max-w-6xl">
        <Link href="/home" className="text-sm font-semibold text-orange-600">← Back to InternLink</Link>
        <div className="mt-5 flex items-center gap-3"><Sparkles className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Cover letter builder</h1></div>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Create an editable, structured internship cover letter using your details. This is a transparent template-based assistant, not a generative AI service.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Your application details</h2>
            <form onSubmit={event => { event.preventDefault(); setLetter(createLetter(form, name)); setNotice("Draft created. Review it before sending."); }}
              className="mt-5 space-y-4">
              <label className="block text-sm font-medium">Your name
                <input className={fieldStyle} maxLength={100} required value={name} onChange={event => { setName(event.target.value); setLetter(""); }} placeholder="Your full name" />
              </label>
              <label className="block text-sm font-medium">Internship title
                <input className={fieldStyle} maxLength={150} required value={form.jobTitle} onChange={event => change("jobTitle", event.target.value)} placeholder="Frontend Developer Intern" />
              </label>
              <label className="block text-sm font-medium">Company
                <input className={fieldStyle} maxLength={120} required value={form.company} onChange={event => change("company", event.target.value)} placeholder="Company name" />
              </label>
              <label className="block text-sm font-medium">Your skills, education and projects
                <textarea className={fieldStyle} maxLength={1200} rows={4} required value={form.background} onChange={event => change("background", event.target.value)} placeholder="Your real experience — e.g. Python, React and a university project" />
              </label>
              <label className="block text-sm font-medium">Role requirements (optional)
                <textarea className={fieldStyle} maxLength={1000} rows={3} value={form.requirements} onChange={event => change("requirements", event.target.value)} placeholder="Key requirements from the internship description" />
              </label>
              <label className="block text-sm font-medium">Tone
                <select className={fieldStyle} value={form.tone} onChange={event => change("tone", event.target.value)}>
                  <option value="enthusiastic">Enthusiastic</option><option value="professional">Professional</option><option value="concise">Concise</option>
                </select>
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff7417] px-5 py-3 font-bold text-white hover:bg-[#e4640e]">
                <Sparkles className="h-4 w-4" /> Generate my letter
              </button>
            </form>
          </section>
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold"><FileText className="h-5 w-5 text-orange-500" /> Letter preview</h2>
              <div className="flex gap-2 print:hidden">
                <button type="button" disabled={!letter} onClick={copyLetter} className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-40">
                  {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>} Copy
                </button>
                <button type="button" disabled={!letter} onClick={printLetter} className="flex items-center gap-1 rounded-lg bg-[#0b1b3e] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">
                  <Printer className="h-4 w-4"/> Save as PDF
                </button>
              </div>
            </div>
            {notice && <p role="status" className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-900 print:hidden">{notice}</p>}
            <div className="mt-6 min-h-[430px] rounded-xl border bg-white p-5 shadow-inner sm:p-8">
              {letter ? (
                <textarea aria-label="Editable cover letter" value={letter} onChange={event => setLetter(event.target.value)}
                  className="h-[460px] w-full resize-y whitespace-pre-wrap border-0 bg-transparent text-sm leading-7 text-slate-800 outline-none print:hidden" />
              ) : <p className="py-24 text-center text-sm text-slate-500 print:hidden">Fill in your details and generate a letter. Your preview will appear here.</p>}
              {letter && <div className="hidden whitespace-pre-wrap text-sm leading-7 text-slate-800 print:block">{letter}</div>}
            </div>
            <p className="mt-4 text-xs text-slate-500 print:hidden">You can edit the draft. Review all claims before sharing. Use your browser’s print dialog to save as PDF.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
