"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  summary: { totalUsers: number; activeJobs: number; totalCompanies: number; totalApplications: number;
    totalStudents: number; totalEmployers: number; pendingCompanies: number; verifiedCompanies: number };
  recentJobs: { _id: string; title: string; companyName: string; status: string; createdAt: string }[];
  recentUsers: { _id: string; fullName: string; email: string; role: string }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async response => { const j = await response.json(); if (!response.ok || !j.success) throw new Error(j.message || "Dashboard unavailable."); return j.data as Stats; })
      .then(setData).catch((e: Error) => setError(e.message));
  }, []);

  const cards = data ? [
    { title: "Registered users", value: data.summary.totalUsers, href: "/admin/students", detail: `${data.summary.totalStudents} students · ${data.summary.totalEmployers} employers` },
    { title: "Active internships", value: data.summary.activeJobs, href: "/admin/internship-posts", detail: "Verified employers only" },
    { title: "Companies", value: data.summary.totalCompanies, href: "/admin/companies", detail: `${data.summary.pendingCompanies} pending verification` },
    { title: "Applications", value: data.summary.totalApplications, href: "/admin/reports", detail: "Submitted applications" },
  ] : [];

  return <div className="il-page-enter min-h-screen bg-[#f6f8fc] p-5 text-[#17233b] sm:p-8">
    <div className="rounded-3xl bg-[#0b1b3e] p-7 text-white">
      <p className="text-sm font-medium text-orange-200">InternLink administration</p>
      <h1 className="mt-2 text-3xl font-bold">Platform overview</h1>
      <p className="mt-2 text-sm text-slate-300">Live statistics from MongoDB · {new Date().toLocaleDateString()}</p>
    </div>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in as admin</Link></p>}
    {!data && !error && <p className="mt-6 text-sm">Loading live dashboard...</p>}
    {data && <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => <Link href={card.href} key={card.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">{card.title}</p>
          <p className="mt-3 text-3xl font-bold">{card.value.toLocaleString()}</p>
          <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
        </Link>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Recent internships</h2>
          <div className="mt-4 space-y-3">{data.recentJobs.length ? data.recentJobs.map(job =>
            <div key={job._id} className="flex flex-wrap items-start justify-between gap-3 border-b pb-3 text-sm">
              <div><p className="font-semibold">{job.title}</p><p className="text-slate-500">{job.companyName}</p></div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{job.status}</span>
            </div>) : <p className="text-sm text-slate-500">No internships posted yet.</p>}</div>
        </section>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Recent accounts</h2>
          <div className="mt-4 space-y-3">{data.recentUsers.length ? data.recentUsers.map(user =>
            <div key={user._id} className="flex items-center justify-between gap-3 border-b pb-3 text-sm">
              <div><p className="font-semibold">{user.fullName}</p><p className="text-slate-500">{user.email}</p></div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{user.role}</span>
            </div>) : <p className="text-sm text-slate-500">No user accounts yet.</p>}</div>
        </section>
      </div>
    </>}
  </div>;
}
