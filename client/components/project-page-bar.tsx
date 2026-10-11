"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const PAGE_LINKS = [
  ["Home", "/home"],
  ["Jobs", "/job-details"],
  ["CV builder", "/"],
  ["Saved jobs", "/saved-jobs"],
  ["Applications", "/applications"],
  ["Recommendations", "/recommendations"],
  ["Notifications", "/notifications"],
  ["Cover letter", "/cover-letter"],
  ["Profile", "/profile"],
  ["Edit profile", "/profile/edit"],
  ["Settings", "/settings"],
  ["Admin dashboard", "/admin/dashboard"],
  ["Students", "/admin/students"],
  ["Companies", "/admin/companies"],
  ["Internship posts", "/admin/internship-posts"],
  ["Add internship", "/admin/internship-posts/add"],
  ["Reports", "/admin/reports"],
  ["Manage companies", "/manage-companies"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Login", "/login"],
  ["Register", "/register"],
  ["Forgot password", "/forgot-password"],
  ["Terms", "/terms-of-service"],
  ["Privacy", "/privacy-policy"],
];

export function ProjectPageBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-[#0b1b41] text-white shadow-md transition-colors hover:bg-[#162b5b]"
        aria-label="Open project navigation"
        aria-expanded={open}
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <aside
          aria-label="Project navigation"
          className="fixed right-0 top-0 z-[60] h-screen w-72 bg-[#0b1b41] text-white shadow-xl"
        >
          <div className="flex h-16 items-center justify-end border-b border-white/10 px-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-2 text-white transition-colors hover:bg-white/10"
              aria-label="Close project navigation"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <nav className="flex h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto px-4 py-4">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/50">
              InternLink pages
            </p>
            {PAGE_LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
}
