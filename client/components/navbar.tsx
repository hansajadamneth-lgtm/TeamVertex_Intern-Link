"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About us", href: "#" },
  { label: "Contact us", href: "#" },
];

const NAV_LINK_CLASS = "text-sm text-gray-200 transition-colors hover:text-white";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative bg-il-navy">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
            <Image
              src="/internlink-logo.png"
              alt="InternLink"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-lg font-bold text-white">
            Intern<span className="text-il-orange">Link</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden flex-1 items-center justify-evenly md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className={NAV_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" className={NAV_LINK_CLASS}>
            Sign In
          </Link>
          <Link href="/register" className={NAV_LINK_CLASS}>
            Register
          </Link>
        </nav>

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
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-3 text-sm text-gray-200 transition-colors hover:bg-white/5 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-3 text-sm text-gray-200 transition-colors hover:bg-white/5 hover:text-white"
          >
            Register
          </Link>
        </nav>
      )}
    </header>
  );
}
