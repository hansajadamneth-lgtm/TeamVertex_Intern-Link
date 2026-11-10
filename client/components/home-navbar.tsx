"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "/home" },
  { label: "Find jobs", href: "/job-details" },
  { label: "CV builder", href: "/cv-builder" },
  { label: "Recommendations", href: "/recommendations" },
  { label: "Applications", href: "/applications" },
];

const MORE_LINKS = [
  { label: "Saved jobs", href: "/saved-jobs" },
  { label: "Notifications", href: "/notifications" },
  { label: "Cover letter", href: "/cover-letter" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

const ADMIN_LINKS = [
  { label: "Admin dashboard", href: "/admin/dashboard" },
  { label: "Students", href: "/admin/students" },
  { label: "Companies", href: "/admin/companies" },
  { label: "Internship posts", href: "/admin/internship-posts" },
  { label: "Reports", href: "/admin/reports" },
];

export function HomeNavbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="relative z-30 border-b border-white/10 bg-il-navy">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-10">
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
        <nav className="hidden flex-wrap items-center justify-center gap-x-1 gap-y-2 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
              aria-expanded={moreOpen}
            >
              More
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-10 z-40 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-il-orange"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-gray-100" />
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Admin workspace
                </p>
                {ADMIN_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-il-orange"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link href="/login">
            <Button size="sm" className="rounded-full px-5 text-xs uppercase">Sign Out</Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-il-navy px-6 pb-4 pt-2 lg:hidden">
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
          <p className="mt-2 px-2 pt-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            More
          </p>
          {[...MORE_LINKS, ...ADMIN_LINKS].map((link) => (
            <Link
              key={link.href}
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
