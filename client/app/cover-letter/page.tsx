"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Copy, FileText, Sparkles } from "lucide-react";

const navItems = [
  { label: "AI Cover Letter", href: "/cover-letter", active: true },
  { label: "Recommendations", href: "#recommendations" },
  { label: "Applications", href: "#applications", count: 4 },
  { label: "Notifications", href: "#notifications" },
];

const defaultForm = {
  jobTitle: "",
  company: "",
  requirements: "",
  background: "",
  tone: "Enthusiastic & Driven (Internship Profile)",
};

export default function CoverLetterPage() {
  const [form, setForm] = useState(defaultForm);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateField = (field: keyof typeof defaultForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setGenerated(false);
  };

  const generateLetter = () => setGenerated(true);

  const coverLetter = `Dear Hiring Manager,

I am excited to apply for the ${form.jobTitle || "Software Engineer"} position at ${form.company || "your company"}. With a strong foundation in frontend development and a passion for building thoughtful digital experiences, I am confident I can make a meaningful contribution to your team.

My experience with React, TypeScript, JavaScript, and responsive UI development has helped me turn ideas into practical, user-focused products. I enjoy learning quickly, collaborating with others, and solving problems with clean, maintainable code.

I would welcome the opportunity to discuss how my skills and enthusiasm align with this role. Thank you for considering my application.

Sincerely,
Hansaja Damneth`;

  const copyLetter = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-[#f4f7fa] text-[#17233b]">
      <header className="bg-[#0b142b] px-4 py-3 sm:px-8">
        <nav className="mx-auto flex max-w-[1120px] items-center justify-between">
          <Link href="/home" aria-label="InternLink home">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden bg-white">
              <Image src="/internlink-logo.png" alt="InternLink" width={40} height={40} className="h-full w-full object-contain" />
            </span>
          </Link>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1 text-[9px] text-white sm:gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-md px-2 py-2 transition-colors sm:px-3 ${
                  item.active ? "bg-[#ff7417] font-semibold" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
                {item.count && <span className="rounded-full bg-[#667085] px-1.5 py-0.5 text-[8px]">{item.count}</span>}
              </a>
            ))}
          </div>
          <button type="button" className="hidden text-[10px] text-slate-300 hover:text-white sm:block">Sign out</button>
        </nav>
      </header>

      <section className="mx-auto max-w-[1120px] px-5 pb-16 pt-10 sm:px-10">
        <div className="mb-7">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[#17233b]">AI Cover Letter Generator</h1>
            <span className="rounded bg-[#fff0e5] px-2 py-1 text-[8px] font-semibold uppercase tracking-wide text-[#e86b18]">Engine v1.0</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7b8799]">AI feature module to instantly create structured professional pitch documents.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section className="overflow-hidden rounded-lg border border-[#dce3eb] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e7ecf1] px-4 py-3">
              <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#17233b]">
                <Sparkles className="h-3 w-3 text-[#ff7417]" /> Target specifications
              </h2>
              <span className="rounded-full bg-[#f1f4f7] px-2 py-1 text-[8px] text-[#8994a4]">MS-INPUT</span>
            </div>
            <div className="space-y-4 p-4">
              <Field label="Target job title" value={form.jobTitle} placeholder="e.g. Associate Software Engineer" onChange={(value) => updateField("jobTitle", value)} />
              <Field label="Company name" value={form.company} placeholder="e.g. WSO2, Dialog Axiata" onChange={(value) => updateField("company", value)} />
              <TextArea label="Job ad / core requirements" value={form.requirements} placeholder="Paste vacancy requirements or required technologies listed on the posting..." onChange={(value) => updateField("requirements", value)} />
              <TextArea label="Your core skills & background" value={form.background} placeholder="e.g. React, Tailwind CSS, Python, Git. Mention active projects or university modules..." onChange={(value) => updateField("background", value)} />
              <Field label="Letter tone profile" value={form.tone} onChange={(value) => updateField("tone", value)} />
              <button type="button" onClick={generateLetter} className="flex w-full items-center justify-center gap-2 rounded-md bg-[#ff7417] py-3 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#e4640e]">
                <Sparkles className="h-3 w-3" /> Generate custom cover letter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-[#dce3eb] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e7ecf1] px-4 py-3">
              <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#17233b]">
                <span className="h-2 w-2 rounded-full bg-[#18b979]" /> Document preview canvas
              </h2>
              <div className="flex gap-2">
                <button type="button" onClick={copyLetter} className="flex items-center gap-1 rounded border border-[#e2e7ed] px-2 py-1.5 text-[9px] text-[#536174] hover:bg-[#f7f9fb]">
                  {copied ? <Check className="h-3 w-3 text-[#18a96d]" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy content"}
                </button>
                <button type="button" onClick={() => window.print()} className="rounded bg-[#356be8] px-3 py-1.5 text-[9px] font-semibold text-white hover:bg-[#2858cc]">Export PDF</button>
              </div>
            </div>
            <div className="min-h-[440px] bg-[#f7f9fb] p-6 sm:p-10">
              <article className="mx-auto min-h-[360px] max-w-[560px] rounded-md border border-[#edf0f3] bg-white p-7 shadow-sm sm:p-10">
                {!generated ? (
                  <div className="flex h-[290px] flex-col items-center justify-center text-center">
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#fff2e8] text-[#ff7417]"><FileText className="h-4 w-4" /></span>
                    <h3 className="text-[13px] font-semibold text-[#17233b]">AI Copywriting Document Canvas</h3>
                    <p className="mt-2 max-w-[260px] text-[10px] leading-4 text-[#8490a2]">Specify job insights inside the configuration metrics panel to trigger the generative copywriting pipeline.</p>
                  </div>
                ) : (
                  <div className="whitespace-pre-line text-[11px] leading-5 text-[#354052]">{coverLetter}</div>
                )}
              </article>
            </div>
            <div className="border-t border-[#e7ecf1] py-3 text-center text-[9px] text-[#8490a2]">InternLink Recruitment Framework · Secure Processing Environment</div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wide text-[#657389]">{label}</span>
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="h-9 w-full rounded-md border border-[#dfe6ed] bg-[#f7f9fb] px-3 text-[10px] text-[#354052] outline-none placeholder:text-[#a9b3c0] focus:border-[#ff9a5b] focus:ring-2 focus:ring-[#ff9a5b]/20" />
    </label>
  );
}

function TextArea({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wide text-[#657389]">{label}</span>
      <textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="h-14 w-full resize-none rounded-md border border-[#dfe6ed] bg-[#f7f9fb] px-3 py-2 text-[10px] leading-4 text-[#354052] outline-none placeholder:text-[#a9b3c0] focus:border-[#ff9a5b] focus:ring-2 focus:ring-[#ff9a5b]/20" />
    </label>
  );
}
