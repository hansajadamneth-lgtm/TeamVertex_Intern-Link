"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      const result = await response.json();
      setError(result.message || "Automatic password recovery is not currently available.");
    } catch {
      setError("Password recovery is currently unavailable. Please contact the platform administrator.");
    } finally { setLoading(false); }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-2xl font-bold">Password assistance</h2>
        <p className="text-sm text-gray-600">Email recovery is not yet configured. If you are signed in, change your password in Account Settings instead.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Account email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input id="forgot-email" type="email" required className="pl-10" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" />
            </div>
          </div>
          {error && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Checking..." : "Check recovery availability"}</Button>
          <div className="flex flex-wrap justify-between gap-3 text-sm">
            <Link href="/settings" className="font-semibold text-orange-600 underline">Change password (signed in)</Link>
            <Link href="/login" className="font-semibold text-orange-600 underline">Back to sign in</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
