"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try {
      const r = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (!r.ok) throw new Error("Sign out failed.");
      router.replace("/login"); router.refresh();
    } catch {
      setBusy(false);
      window.alert("Unable to sign out. Please try again.");
    }
  }
  return <button type="button" onClick={signOut} disabled={busy}
    className={className || "rounded-xl border border-white/10 px-4 py-3 text-sm text-white hover:bg-white/10 disabled:opacity-50"}>
    {busy ? "Signing out..." : "Sign out"}
  </button>;
}
