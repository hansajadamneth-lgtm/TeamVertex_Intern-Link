"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ClipboardList, Download, Eye, X } from "lucide-react";

type ApplicationStatus = "Interview scheduled" | "Under review" | "Application sent";

type Application = {
  company: string;
  position: string;
  date: string;
  fit: number;
  status: ApplicationStatus;
  action: "View Invite" | "Details Pending" | "Download Copy";
};

const applications: Application[] = [
  {
    company: "WSO2 Lanka",
    position: "Associate Software Engineer",
    date: "July 16, 2025",
    fit: 94,
    status: "Interview scheduled",
    action: "View Invite",
  },
  {
    company: "Dialog Axiata PLC",
    position: "Full-Stack Web Intern",
    date: "July 14, 2025",
    fit: 89,
    status: "Under review",
    action: "Details Pending",
  },
  {
    company: "Sysco LABS",
    position: "Quality Assurance Intern",
    date: "July 12, 2025",
    fit: 86,
    status: "Application sent",
    action: "Download Copy",
  },
  {
    company: "London Stock Exchange Group",
    position: "Cloud Solutions Intern",
    date: "July 08, 2025",
    fit: 72,
    status: "Application sent",
    action: "Download Copy",
  },
];

const navItems = [
  { label: "AI Cover Letter", href: "/cover-letter" },
  { label: "Recommendations", href: "/recommendations" },
  { label: "Applications", href: "/applications", active: true, count: 4 },
  { label: "Notifications", href: "/notifications" },
];

export default function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

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
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-md px-2 py-2 transition-colors sm:px-3 ${
                  item.active ? "bg-[#ff7417] font-semibold" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
                {item.count && <span className="rounded-full bg-[#667085] px-1.5 py-0.5 text-[8px]">{item.count}</span>}
              </Link>
            ))}
          </div>
          <Link href="/login" className="hidden text-[10px] text-slate-300 hover:text-white sm:block">Sign out</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1120px] px-5 pb-20 pt-10 sm:px-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-[#17233b]">Application Tracking Dashboard</h1>
              <span className="rounded bg-[#fff0e5] px-2 py-1 text-[8px] font-semibold uppercase tracking-wide text-[#e86b18]">Live tracking</span>
            </div>
            <p className="mt-1 text-[11px] text-[#7b8799]">Manage and track the real-time review progress of your submitted internship recruitment streams.</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <SummaryCard label="Total" value="04" />
            <SummaryCard label="Interview" value="01" accent />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 sm:hidden">
          <SummaryCard label="Total" value="04" />
          <SummaryCard label="Interview" value="01" accent />
        </div>

        <div className="overflow-hidden rounded-lg border border-[#dce3eb] bg-white shadow-sm">
          <div className="hidden grid-cols-[1.45fr_1fr_0.8fr_1.25fr_0.9fr] border-b border-[#e7ecf1] bg-[#fbfcfd] px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#657389] md:grid">
            <span>Company / position</span>
            <span>Date submitted</span>
            <span>AI fit score</span>
            <span>Recruitment status</span>
            <span className="text-right">Action board</span>
          </div>
          <div className="divide-y divide-[#e7ecf1]">
            {applications.map((application) => (
              <div key={`${application.company}-${application.position}`} className="grid gap-3 px-5 py-4 transition-colors hover:bg-[#fbfcfd] md:grid-cols-[1.45fr_1fr_0.8fr_1.25fr_0.9fr] md:items-center">
                <div>
                  <p className="text-[11px] font-semibold text-[#17233b]">{application.position}</p>
                  <p className="mt-1 text-[9px] text-[#ff7417]">{application.company}</p>
                </div>
                <div className="text-[10px] text-[#7b8799]">
                  <span className="mr-2 font-semibold uppercase text-[#657389] md:hidden">Submitted:</span>
                  {application.date}
                </div>
                <div>
                  <span className={`inline-flex rounded border px-2 py-1 text-[9px] font-semibold ${application.fit >= 90 ? "border-[#bcefd5] bg-[#effcf5] text-[#18a96d]" : application.fit >= 80 ? "border-[#c9ddff] bg-[#f0f6ff] text-[#4176c8]" : "border-[#f5d789] bg-[#fff9e9] text-[#c38d08]"}`}>
                    {application.fit}% Fit
                  </span>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-wide ${application.status === "Interview scheduled" ? "border border-[#ffd6b6] bg-[#fff7f0] text-[#f07a29]" : application.status === "Under review" ? "border border-[#cbdfff] bg-[#f1f6ff] text-[#4775bd]" : "bg-[#eef2f6] text-[#617187]"}`}>
                    {application.status}
                  </span>
                </div>
                <button type="button" onClick={() => setSelectedApplication(application)} className="flex items-center gap-1 text-left text-[9px] font-semibold text-[#356be8] hover:text-[#214cb3] md:justify-end">
                  {application.action === "View Invite" && <Eye className="h-3 w-3" />}
                  {application.action === "Download Copy" && <Download className="h-3 w-3" />}
                  {application.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-32 border-t border-[#e1e6eb] pt-4 text-center text-[9px] text-[#8490a2]">InternLink Management Pipeline · Core Processing Workspace Secure</p>
      </section>

      {selectedApplication && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#0b142b]/40 px-5" role="dialog" aria-modal="true" aria-label="Application details">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-[#ff7417]">{selectedApplication.company}</p>
                <h2 className="mt-1 text-lg font-semibold text-[#17233b]">{selectedApplication.position}</h2>
              </div>
              <button type="button" onClick={() => setSelectedApplication(null)} aria-label="Close application details" className="rounded-full p-1 text-[#7b8799] hover:bg-[#f1f4f7]"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 space-y-3 text-[11px] text-[#536174]">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#18a96d]" /> Application status: {selectedApplication.status}</p>
              <p className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-[#356be8]" /> Submitted on {selectedApplication.date}</p>
              <p className="flex items-center gap-2"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#fff0e5] text-[8px] text-[#ff7417]">AI</span> AI fit score: {selectedApplication.fit}%</p>
            </div>
            <button type="button" onClick={() => setSelectedApplication(null)} className="mt-6 w-full rounded-md bg-[#0b142b] py-2.5 text-[10px] font-semibold text-white hover:bg-[#182647]">Close details</button>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`min-w-[58px] rounded-md border px-3 py-2 text-center ${accent ? "border-[#ffe0c9] bg-[#fffaf6]" : "border-[#e0e6ed] bg-white"}`}>
      <p className={`text-[8px] font-bold uppercase tracking-wide ${accent ? "text-[#ff7417]" : "text-[#657389]"}`}>{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#17233b]">{value}</p>
    </div>
  );
}
