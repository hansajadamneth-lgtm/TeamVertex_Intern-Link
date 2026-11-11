"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Profile = {
  fullName: string; email: string; role: string;
  phone: string; location: string; education: string; bio: string; skills: string[];
};
const blank: Profile = { fullName: "", email: "", role: "", phone: "", location: "", education: "", bio: "", skills: [] };

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile>(blank);
  const [skillsText, setSkillsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Sign in to edit your profile.");
        return data.user as Profile;
      })
      .then((user) => {
        if (!active) return;
        setProfile({ ...blank, ...user, skills: user.skills || [] });
        setSkillsText((user.skills || []).join(", "));
      })
      .catch((err: Error) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    const skills = [...new Set(skillsText.split(",").map(s => s.trim()).filter(Boolean))];
    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: profile.fullName, phone: profile.phone,
          location: profile.location, education: profile.education, bio: profile.bio, skills }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.message || "Could not save profile.");
      setProfile({ ...blank, ...json.user });
      setSkillsText((json.user.skills || []).join(", "));
      setNotice("Profile saved. Your new skills will improve internship matching.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save profile."); }
    finally { setSaving(false); }
  }

  const fields: { key: "fullName" | "phone" | "location" | "education"; label: string; max: number }[] = [
    { key: "fullName", label: "Full name", max: 100 },
    { key: "phone", label: "Phone (optional)", max: 40 },
    { key: "location", label: "Location", max: 120 },
    { key: "education", label: "Course / education", max: 200 },
  ];
  return (
    <main className="il-page-enter min-h-screen bg-[#f6f8fc] px-4 py-10 text-[#17233b] sm:px-8">
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-10">
        <Link href="/profile" className="text-sm font-semibold text-[#ff7417]">← Back to profile</Link>
        <h1 className="mt-4 text-3xl font-bold">Edit your profile</h1>
        <p className="mt-2 text-sm text-slate-500">Keep your details and skills current for more relevant internship recommendations.</p>
        {loading && <p className="mt-6 text-sm">Loading your profile...</p>}
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <Link href="/login" className="underline">Sign in</Link></p>}
        {notice && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800">{notice}</p>}
        {!loading && profile.email && (
          <form onSubmit={save} className="mt-7 space-y-5">
            <div className="rounded-xl bg-slate-50 p-4 text-sm"><span className="font-semibold">Account:</span> {profile.email} · {profile.role} <span className="block text-xs text-slate-500">Email and role cannot be changed here.</span></div>
            {fields.map(({ key, label, max }) => (
              <label key={key} className="block text-sm font-medium">
                {label}
                <input required={key === "fullName"} maxLength={max} value={profile[key] || ""}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500" />
              </label>
            ))}
            <label className="block text-sm font-medium">Skills (comma-separated)
              <textarea value={skillsText} onChange={e => setSkillsText(e.target.value)}
                rows={3} placeholder="React, JavaScript, Python, SQL"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500" />
            </label>
            <label className="block text-sm font-medium">About yourself
              <textarea maxLength={1200} value={profile.bio || ""} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                rows={4} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500" />
            </label>
            <button disabled={saving} type="submit" className="rounded-xl bg-[#ff7417] px-7 py-3 font-semibold text-white hover:bg-[#df6110] disabled:opacity-60">
              {saving ? "Saving..." : "Save profile"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
