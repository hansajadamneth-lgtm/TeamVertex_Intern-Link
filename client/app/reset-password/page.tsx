"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (newPassword.length < 10 || newPassword.length > 128 || newPassword !== confirmPassword) {
      setError("Password must be 10–128 characters and match its confirmation.");
      return;
    }
    const token = new URLSearchParams(window.location.search).get("token") || "";
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      setError("Reset link is missing or invalid. Please request another link.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to reset password.");
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      window.history.replaceState(null, "", "/reset-password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="min-h-screen bg-[#f6f8fc] px-5 py-14 text-[#17233b]">
    <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
      <p className="text-sm font-semibold text-orange-600">InternLink account security</p>
      <h1 className="mt-2 text-3xl font-bold">Reset your password</h1>
      {success ? <>
        <p role="status" className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-800">
          Password updated. All previous sessions have been invalidated.
        </p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-[#ff7417] px-5 py-3 font-bold text-white">Sign in</Link>
      </> : <>
        <p className="mt-3 text-sm text-slate-600">Set a new password using the one-time link from your email. The link expires after 15 minutes.</p>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">New password
            <input type="password" required minLength={10} maxLength={128} autoComplete="new-password"
              value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="block text-sm font-semibold">Confirm password
            <input type="password" required minLength={10} maxLength={128} autoComplete="new-password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <button disabled={busy} className="w-full rounded-xl bg-[#ff7417] px-5 py-3 font-bold text-white disabled:opacity-50">
            {busy ? "Updating..." : "Reset password"}
          </button>
        </form>
        <Link href="/forgot-password" className="mt-5 inline-block text-sm font-semibold text-orange-700 underline">Request a new link</Link>
      </>}
    </section>
  </main>;
}
