"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCircle2, FileText } from "lucide-react";

type Application = { _id: string; status: string; position?: string; companyName?: string; createdAt: string };
export default function NotificationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [who, results] = await Promise.all([
          fetch("/api/auth/me", { cache: "no-store" }), fetch("/api/applications/me", { cache: "no-store" }),
        ]);
        const [profile, data] = await Promise.all([who.json(), results.json()]);
        if (!who.ok || !profile.success || !results.ok || !data.success) throw new Error(data.message || "Sign in as a student to view updates.");
        if (!active) return;
        const uid = profile.user.id as string;
        setUserId(uid);
        setApps(data.data || []);
        try { setReadIds(JSON.parse(window.localStorage.getItem(`internlink-notifications-read-${uid}`) || "[]")); } catch { setReadIds([]); }
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Unable to load updates."); }
      finally { if (active) setLoading(false); }
    }
    load(); return () => { active = false; };
  }, []);
  const updates = apps.map(app => ({
    id: `${app._id}:${app.status}`,
    title: app.status === "Application sent" ? "Application submitted" : `Application: ${app.status}`,
    description: `${app.position || "Internship"} at ${app.companyName || "Employer"} — ${app.status}`,
    date: new Date(app.createdAt).toLocaleDateString(),
    icon: app.status==="Accepted" ? CheckCircle2 : app.status==="Application sent" ? FileText : Bell,
  }));
  const unread = updates.filter(u => !readIds.includes(u.id)).length;
  function markAllRead() {
    const ids = updates.map(u=>u.id);
    setReadIds(ids);
    try { window.localStorage.setItem(`internlink-notifications-read-${userId}`, JSON.stringify(ids)); } catch {}
  }
  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] px-5 py-10 text-[#17233b]">
    <section className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="flex items-center gap-2 text-3xl font-bold"><Bell className="text-orange-500"/> Application updates</h1>
          <p className="mt-2 text-sm text-slate-500">Live updates based on your submitted internship applications.</p></div>
        <button type="button" onClick={markAllRead} disabled={!updates.length || unread===0} className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">Mark all as read {unread>0?`(${unread})`:""}</button>
      </div>
      {loading && <p className="mt-7 text-sm">Loading updates...</p>}
      {error && <p role="alert" className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in</Link></p>}
      {!loading && !error && updates.length===0 && <div className="mt-7 rounded-2xl border bg-white p-8 text-center">
        <Bell className="mx-auto h-8 w-8 text-slate-400"/><p className="mt-3 font-semibold">No application updates yet.</p>
        <p className="mt-2 text-sm text-slate-500">Apply to an internship to track real employer responses here.</p>
        <Link href="/job-details" className="mt-4 inline-block text-sm font-semibold text-orange-600">Find internships</Link></div>}
      <div className="mt-7 space-y-3">{updates.map(u=> <article key={u.id} className={`flex gap-4 rounded-2xl border p-6 shadow-sm ${readIds.includes(u.id)?"bg-white":"border-orange-200 bg-orange-50/50"}`}>
        <u.icon className="h-6 w-6 shrink-0 text-orange-600"/>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2">
          <h2 className="font-semibold">{u.title}</h2><span className="text-xs text-slate-500">{u.date}</span></div>
          <p className="mt-1 text-sm text-slate-600">{u.description}</p>
          <Link href="/applications" className="mt-3 inline-block text-xs font-semibold text-orange-600">View application</Link>
        </div>
      </article>)}</div>
      {updates.length>0 && <p className="mt-5 text-xs text-slate-500">Read/unread preferences are saved on this browser. Application statuses come from your account.</p>}
    </section>
  </main>;
}
