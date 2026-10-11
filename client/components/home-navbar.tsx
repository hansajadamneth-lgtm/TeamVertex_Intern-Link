"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "/home" },
  { label: "Find jobs", href: "/job-details" },
  { label: "cv builder", href: "/" },
  { label: "Recommendation", href: "/recommendations" },
  { label: "Saved", href: "/saved-jobs" },
];

export function HomeNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative bg-il-navy">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <Image
              src="/internlink-logo.png"
              alt="InternLink"
              width={26}
              height={26}
              className="h-6 w-6 object-contain"
            />
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-gray-200 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href="/login">
            <Button size="sm" className="rounded-full px-5 text-xs uppercase">Sign Out</Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-il-navy px-6 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-sm text-gray-200 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="mt-2">
            <Button className="w-full rounded-md">Sign Out</Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
