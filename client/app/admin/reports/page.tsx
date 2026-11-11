"use client";

import { useEffect, useState } from "react";
type Report = {
  summary: { totalApplications: number; totalCompanies: number; totalInternships: number; totalStudents: number };
  jobsByStatus: Record<string, number>; jobsByCategory: Record<string, number>;
  applicationsByStatus: Record<string, number>;
};
export default function ReportsPage() {
  const [data, setData] = useState<Report | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/reports", { cache: "no-store" }).then(async r=>{
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Unable to load reports.");
      return j.data as Report;
    }).then(setData).catch((e: Error)=>setError(e.message));
  }, []);

  function exportCsv() {
    if (!data) return;
    const rows: string[][] = [["Category","Metric","Count"]];
    for (const [key,n] of Object.entries(data.summary)) rows.push(["Summary",key,String(n)]);
    for (const [type,record] of Object.entries({
      "Jobs by status":data.jobsByStatus, "Jobs by category":data.jobsByCategory,
      "Applications by status":data.applicationsByStatus,
    })) for (const [key,n] of Object.entries(record || {})) rows.push([type,key,String(n)]);
    const csv = rows.map(row=>row.map(cell=>`"${cell.replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const link = document.createElement("a"); link.href=url; link.download="internlink-admin-report.csv";
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }
  const summary = data ? [
    ["Total applications", data.summary.totalApplications],
    ["Companies", data.summary.totalCompanies],
    ["Internships", data.summary.totalInternships],
    ["Students", data.summary.totalStudents],
  ] as const : [];
  const panels = data ? [
    ["Internship statuses",data.jobsByStatus],
    ["Internship categories",data.jobsByCategory],
    ["Application statuses",data.applicationsByStatus],
  ] as const : [];
  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] p-5 text-[#17233b] sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">Recruitment reports</h1>
        <p className="mt-2 text-sm text-slate-500">Live aggregated statistics from InternLink data, not estimates.</p></div>
      <button type="button" disabled={!data} onClick={exportCsv}
        className="rounded-xl bg-[#0b1b3e] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Export CSV</button>
    </div>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {!error && !data && <p className="mt-6 text-sm">Loading live reports...</p>}
    {data && <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(([label,value])=><div key={label} className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold">{value.toLocaleString()}</p>
        </div>)}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {panels.map(([title,record])=><section key={title} className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">{title}</h2>
          <div className="mt-5 space-y-4">{Object.entries(record || {}).map(([label,count])=>{
            const highest=Math.max(1,...Object.values(record || {}));
            return <div key={label}>
              <div className="flex justify-between gap-3 text-sm"><span>{label}</span><span className="font-semibold">{count}</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#ff7417]" style={{width:`${Math.round(100*count/highest)}%`}}/></div>
            </div>;
          })}</div>
        </section>)}
      </div>
    </>}
  </main>;
}
