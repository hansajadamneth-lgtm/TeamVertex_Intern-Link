"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Company = { _id: string; name: string; industry: string; email: string; status: "Verified" | "Pending" | "Suspended"; createdAt?: string };
export default function ManageCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState("");
  const refresh = useCallback(async () => {
    const r = await fetch("/api/admin/companies", { cache: "no-store" });
    const j = await r.json();
    if (!r.ok || !j.success) throw new Error(j.message || "Could not load companies.");
    setCompanies(j.data || []);
  }, []);
  useEffect(() => { refresh().catch(e => setError(e.message)).finally(() => setLoading(false)); }, [refresh]);
  async function setStatus(id: string, status: Company["status"]) {
    if (!window.confirm(`Change company verification status to ${status}?`)) return;
    setChanging(id); setError(""); setNotice("");
    try {
      const r = await fetch(`/api/companies/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Could not update status.");
      setNotice("Company status updated successfully.");
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not update company."); }
    finally { setChanging(""); }
  }
  const filtered = companies.filter(c => [c.name,c.industry,c.email,c.status].join(" ").toLowerCase().includes(search.toLowerCase()));
  const counts = { total: companies.length, verified: companies.filter(c=>c.status==="Verified").length,
    pending: companies.filter(c=>c.status==="Pending").length, suspended: companies.filter(c=>c.status==="Suspended").length };
  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] p-5 text-[#17233b] sm:p-8">
    <h1 className="text-3xl font-bold">Company verification</h1>
    <p className="mt-2 text-sm text-slate-500">Only verified companies can publish public internship listings.</p>
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Object.entries(counts).map(([label,n]) => <div key={label} className="rounded-2xl border bg-white p-5"><p className="text-sm capitalize text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{n}</p></div>)}
    </div>
    <input aria-label="Search companies" placeholder="Search companies by name, email, industry or status..."
      value={search} onChange={e=>setSearch(e.target.value)}
      className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-orange-500" />
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
    <div className="mt-5 overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Company</th><th className="p-4">Industry</th><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead>
        <tbody>{filtered.map(c => <tr key={c._id} className="border-t">
          <td className="p-4 font-semibold">{c.name}</td><td className="p-4">{c.industry}</td><td className="p-4">{c.email}</td>
          <td className="p-4"><span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-700">{c.status}</span></td>
          <td className="p-4"><div className="flex flex-wrap gap-2">
            {c.status !== "Verified" && <button disabled={changing===c._id} onClick={()=>setStatus(c._id,"Verified")} className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Verify</button>}
            {c.status !== "Suspended" && <button disabled={changing===c._id} onClick={()=>setStatus(c._id,"Suspended")} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50">Suspend</button>}
            {c.status !== "Pending" && <button disabled={changing===c._id} onClick={()=>setStatus(c._id,"Pending")} className="rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50">Pending</button>}
          </div></td>
        </tr>)}</tbody>
      </table>
      {!loading && filtered.length===0 && <p className="p-8 text-center text-sm text-slate-500">No companies match. New employer registrations will appear here.</p>}
      {loading && <p className="p-6 text-sm">Loading companies...</p>}
    </div>
    <Link href="/admin/dashboard" className="mt-6 inline-block text-sm font-semibold text-orange-600">← Back to dashboard</Link>
  </main>;
}
