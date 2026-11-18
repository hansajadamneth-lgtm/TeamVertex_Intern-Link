"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BriefcaseBusiness, Building2, GraduationCap, LayoutDashboard, Mail } from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: GraduationCap },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/internship-posts", label: "Internship Posts", icon: BriefcaseBusiness },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/contact-messages", label: "Contact inbox", icon: Mail },
];

export function AdminSidebarNavigation() {
  const pathname = usePathname() || "/admin/dashboard";

  return (
    <nav aria-label="Admin navigation" className="flex-1 overflow-x-auto px-3 py-3 lg:overflow-y-auto lg:py-6">
      <div className="flex gap-2 lg:flex-col">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={[
                "inline-flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300",
                active
                  ? "border-orange-400/70 bg-orange-400/20 text-orange-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_18px_-10px_rgba(251,146,60,0.85)]"
                  : "border-transparent text-white/80 hover:border-white/15 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
