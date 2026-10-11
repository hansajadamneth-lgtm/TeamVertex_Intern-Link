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
      <aside
        aria-label="Project navigation"
        className={`fixed left-0 top-0 z-50 h-screen bg-[#0b1b41] text-white shadow-xl transition-all duration-200 ${
          open ? "w-64" : "w-16"
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-md p-2 text-white transition-colors hover:bg-white/10"
            aria-label={open ? "Close project navigation" : "Open project navigation"}
            aria-expanded={open}
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {open && (
          <nav className="flex h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto px-3 py-4">
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
        )}
      </aside>
    </>
  );
}
