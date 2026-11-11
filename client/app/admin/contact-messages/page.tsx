"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Message = { _id: string; fullName: string; email: string; subject: string; message: string; createdAt: string };

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/contact", { cache: "no-store" }).then(async response => {
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Messages unavailable.");
      setMessages(data.data || []);
    }).catch(err => setError(err instanceof Error ? err.message : "Messages unavailable."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-[#f6f8fc] p-5 text-[#17233b] sm:p-8">
      <h1 className="text-3xl font-bold">Contact inbox</h1>
      <p className="mt-2 text-sm text-slate-600">Latest 100 support requests. Visible only to authorized administrators.</p>
      {loading && <p role="status" className="mt-6">Loading messages...</p>}
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!loading && !error && messages.length === 0 && <p className="mt-6 rounded-xl border bg-white p-7 text-sm">No contact submissions yet.</p>}
      <div className="mt-6 space-y-4">{messages.map(item => (
        <article key={item._id} className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <h2 className="text-lg font-semibold">{item.subject}</h2>
            <time dateTime={item.createdAt} className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</time>
          </div>
          <p className="mt-2 text-sm text-slate-600">{item.fullName} · <a href={"mailto:" + item.email} className="underline">{item.email}</a></p>
          <p className="mt-4 whitespace-pre-wrap break-words text-sm text-slate-800">{item.message}</p>
        </article>
      ))}</div>
      <Link href="/admin/dashboard" className="mt-6 inline-block text-sm font-semibold text-orange-600">← Back to dashboard</Link>
    </section>
  );
}
