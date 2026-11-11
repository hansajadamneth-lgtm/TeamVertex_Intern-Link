"use client";

import { useState } from "react";
import { User, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, subject, message }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to submit message.");
      setSuccess("Your message has been securely saved for the InternLink administrators.");
      setFullName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit message.");
    } finally { setLoading(false); }
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="pb-0">
        <h2 className="text-xl font-bold text-gray-900">Send Us a Message</h2>
        <p className="mt-1 text-sm text-gray-500">Submit your question to our administration inbox. No external email service is required.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="relative block">
              <span className="sr-only">Full name</span>
              <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Full name" aria-label="Full name" className="pl-10" maxLength={100}
                value={fullName} onChange={e => setFullName(e.target.value)} required />
            </label>
            <label className="relative block">
              <span className="sr-only">Email address</span>
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input type="email" placeholder="Email address" aria-label="Email address" className="pl-10"
                maxLength={254} value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
          </div>
          <Input placeholder="Subject" aria-label="Subject" maxLength={160} value={subject}
            onChange={e => setSubject(e.target.value)} required />
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Your message (minimum 10 characters)" aria-label="Your message"
            rows={5} minLength={10} maxLength={3000} required
            className="flex w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400" />
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {success && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">{success}</p>}
          <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">{loading ? "Sending..." : "Send Message"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
