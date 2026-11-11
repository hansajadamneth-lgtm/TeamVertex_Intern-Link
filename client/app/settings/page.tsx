"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setNotice("");
    if (newPassword.length < 10 || newPassword.length > 128) {
      setError("Your new password must contain 10 to 128 characters."); return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match."); return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to change password.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setNotice("Password updated. All your other sessions have been signed out.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to change password."); }
    finally { setBusy(false); }
  }

  return <main className="il-page-enter min-h-screen bg-[#f6f8fc] px-5 py-10 text-[#17233b]">
    <section className="mx-auto max-w-2xl rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
      <Link href="/home" className="text-sm font-semibold text-orange-600">← Back to InternLink</Link>
      <h1 className="mt-4 text-3xl font-bold">Account settings</h1>
      <p className="mt-2 text-sm text-slate-500">Manage your account securely. Password changes invalidate other signed-in sessions.</p>
      <Link href="/profile/edit" className="mt-6 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-slate-50">Edit profile and skills</Link>
      <div className="mt-8 border-t pt-7">
        <h2 className="text-xl font-bold">Change your password</h2>
        <p className="mt-2 text-sm text-slate-500">Use a strong, unique password with at least 10 characters.</p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
        <form onSubmit={save} className="mt-6 space-y-4">
          {[
            { label: "Current password", value: currentPassword, set: setCurrentPassword },
            { label: "New password", value: newPassword, set: setNewPassword },
            { label: "Confirm new password", value: confirmPassword, set: setConfirmPassword },
          ].map(field => <label key={field.label} className="block text-sm font-semibold">
            {field.label}
            <input type="password" required minLength={field.label==="Current password"?1:10}
              maxLength={128} value={field.value} onChange={e=>field.set(e.target.value)}
              autoComplete={field.label==="Current password"?"current-password":"new-password"}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500" />
          </label>)}
          <button type="submit" disabled={busy} className="rounded-xl bg-[#ff7417] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">
            {busy ? "Saving..." : "Change password"}
          </button>
        </form>
      </div>
    </section>
  </main>;
}
