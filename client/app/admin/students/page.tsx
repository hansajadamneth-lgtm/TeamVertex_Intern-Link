"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Student = { _id: string; fullName: string; email: string; education?: string; status: string; location?: string; skills?: string[] };
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [loading, setLoading] = useState(true);
  async function refresh() {
    const r = await fetch("/api/admin/students?limit=50", { cache: "no-store" });
    const j = await r.json();
    if (!r.ok || !j.success) throw new Error(j.message || "Unable to load students.");
    setStudents(j.data || []);
  }
  useEffect(() => { refresh().catch((e: Error)=>setError(e.message)).finally(()=>setLoading(false)); }, []);
  async function updateStatus(id: string, status: string) {
    setBusy(id); setError(""); setNotice("");
    try {
      const r = await fetch(`/api/admin/students/${id}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Unable to update student.");
      setNotice("Student status updated.");
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update student."); }
    finally { setBusy(""); }
  }
  const visible = students.filter(s=>[s.fullName,s.email,s.education,s.status,s.location].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] p-5 text-[#17233b] sm:p-8">
    <h1 className="text-3xl font-bold">Student accounts</h1>
    <p className="mt-2 text-sm text-slate-500">Live student accounts. New students sign up through the normal registration flow.</p>
    <input aria-label="Search student accounts" value={search} onChange={e=>setSearch(e.target.value)}
      placeholder="Search student by name, email or education..."
      className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-orange-500"/>
    {loading && <p className="mt-5 text-sm">Loading students...</p>}
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
    <div className="mt-6 overflow-x-auto rounded-2xl border bg-white shadow-sm"><table className="w-full min-w-[700px] text-left text-sm">
      <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Student</th><th className="p-4">Education</th><th className="p-4">Skills</th><th className="p-4">Status</th><th className="p-4">Manage status</th></tr></thead>
      <tbody>{visible.map(s=><tr className="border-t" key={s._id}>
        <td className="p-4"><p className="font-semibold">{s.fullName}</p><p className="text-xs text-slate-500">{s.email}</p></td>
        <td className="p-4">{s.education || "Not supplied"}</td><td className="p-4 text-xs">{(s.skills||[]).slice(0,4).join(", ") || "No skills"}</td>
        <td className="p-4">{s.status}</td>
        <td className="p-4"><select disabled={busy===s._id} value={s.status} onChange={e=>updateStatus(s._id,e.target.value)}
          aria-label={`Status for ${s.fullName}`} className="rounded-lg border px-3 py-2 text-sm">
          {["Active","Pending","Inactive"].map(x=><option key={x}>{x}</option>)}
        </select></td>
      </tr>)}</tbody>
    </table>
    {!loading && !error && visible.length===0 && <p className="p-7 text-sm text-slate-500">No student accounts found.</p>}
    </div>
    <Link href="/admin/dashboard" className="mt-6 inline-block text-sm font-semibold text-orange-600">← Back to dashboard</Link>
  </main>;
}
