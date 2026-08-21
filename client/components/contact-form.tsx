"use client";

import { useState } from "react";
import { User, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ContactForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wire up to your real contact-form submission logic here.
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="pb-0">
        <h2 className="text-xl font-bold text-gray-900">Send Us a Message</h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill out the form below and we&apos;ll get back to you as soon as
          possible.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Full name" className="pl-10" required />
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                placeholder="Email Address"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Input placeholder="Subject" required />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            rows={5}
            required
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-il-orange/40 focus-visible:border-il-orange"
          />

          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
