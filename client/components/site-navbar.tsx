"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Home, LogOut, Menu, X } from "lucide-react";

type NavLink = { label: string; href: string };
type Account = { fullName?: string; role?: string };

const MAIN_LINKS: NavLink[] = [
  { label: "Home", href: "/home" },
  { label: "Find jobs", href: "/job-details" },
  { label: "CV builder", href: "/cv-builder" },
  { label: "Recommendations", href: "/recommendations" },
  { label: "Applications", href: "/applications" },
];

const MORE_LINKS: NavLink[] = [
  { label: "Resume upload", href: "/" },
  { label: "Saved jobs", href: "/saved-jobs" },
  { label: "Notifications", href: "/notifications" },
  { label: "Cover letter", href: "/cover-letter" },
  { label: "My profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
];

const ADMIN_LINKS: NavLink[] = [
  { label: "Admin dashboard", href: "/admin/dashboard" },
  { label: "Students", href: "/admin/students" },
  { label: "Companies", href: "/admin/companies" },
  { label: "Internship posts", href: "/admin/internship-posts" },
  { label: "Reports", href: "/admin/reports" },
];

const GUEST_LINKS: NavLink[] = [
  { label: "Sign in", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Forgot password", href: "/forgot-password" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function pageName(pathname: string) {
  const known: NavLink[] = [
    ...MAIN_LINKS,
    ...MORE_LINKS,
    ...ADMIN_LINKS,
    ...GUEST_LINKS,
    { label: "Add internship", href: "/admin/internship-posts/add" },
    { label: "Manage companies", href: "/manage-companies" },
  ];
  const match = [...known].sort((a, b) => b.href.length - a.href.length).find((item) => isActive(pathname, item.href));
  if (match) return match.label;
  return pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? "Home";
}

export function SiteNavbar() {
  const pathname = usePathname() || "/home";
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store", credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.success ? (data.user as Account) : null;
      })
      .then((user) => { if (active) { setAccount(user); setAuthLoaded(true); } })
      .catch(() => { if (active) { setAccount(null); setAuthLoaded(true); } });
    return () => { active = false; };
  }, [pathname]);

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (event.target instanceof Node && !moreRef.current?.contains(event.target)) setMoreOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function signOut() {
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (!response.ok) throw new Error("Could not sign out.");
      setAccount(null);
      setMobileOpen(false);
      setMoreOpen(false);
      router.replace("/login");
      router.refresh();
    } catch {
      setLogoutError("Sign out failed. Please try again.");
    }
  }

  const moreLinks = [
    ...MORE_LINKS,
    ...(account?.role === "admin" ? ADMIN_LINKS : []),
    ...(!account ? GUEST_LINKS : []),
  ];
  const mainActive = MAIN_LINKS.some((link) => isActive(pathname, link.href));
  const moreActive = moreLinks.some((link) => isActive(pathname, link.href)) || (!mainActive && pathname.startsWith("/admin/"));
  const currentPage = pageName(pathname);

  function linkClasses(active: boolean, mobile = false) {
    return [
      "il-nav-link inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold",
      "transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5821f]",
      mobile ? "w-full justify-start px-5 py-3" : "",
      active
        ? "il-nav-active text-white"
        : "text-slate-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white",
    ].join(" ");
  }

  return (
    <div className="il-site-navigation sticky top-0 z-50 w-full print:hidden">
      <header className="border-b border-white/10 bg-[#0b1b3e]/95 shadow-[0_5px_25px_-17px_rgba(0,0,0,.65)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] w-full max-w-[1500px] items-center gap-5 px-4 sm:px-6 lg:px-9">
          <Link href="/home" aria-label="InternLink Home" className="flex shrink-0 items-center gap-2.5 rounded-xl p-1 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1 shadow-sm">
              <Image src="/internlink-logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            </span>
            <span className="hidden text-lg font-bold tracking-tight sm:inline">Intern<span className="text-[#f5821f]">Link</span></span>
          </Link>

          <nav aria-label="Main navigation" className="ml-auto hidden min-w-0 items-center gap-1 xl:flex">
            {MAIN_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={linkClasses(active)}>
                  {link.label}
                </Link>
              );
            })}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={moreOpen}
                aria-controls="il-more-menu"
                onClick={() => setMoreOpen((value) => !value)}
                className={linkClasses(moreActive)}
              >
                More <ChevronDown className={"ml-1 h-4 w-4 transition-transform duration-200 " + (moreOpen ? "rotate-180" : "")} aria-hidden="true" />
              </button>
              {moreOpen && (
                <div id="il-more-menu" className="absolute right-0 top-[calc(100%+12px)] z-50 max-h-[min(72vh,620px)] w-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_65px_-20px_rgba(11,27,62,.35)]">
                  <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Explore InternLink</p>
                  {moreLinks.map((link) => {
                    const active = isActive(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMoreOpen(false)}
                        className={"flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " + (active ? "bg-orange-50 font-bold text-[#b45309]" : "text-slate-700 hover:bg-slate-100 hover:text-[#0b1b3e]")}
                      >
                        {link.label}
                        {active && <span className="h-2 w-2 rounded-full bg-[#f5821f]" aria-hidden="true" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-3">
            {authLoaded && (account ? (
              <button type="button" onClick={signOut} className="hidden rounded-full bg-[#f5821f] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e77210] hover:shadow-[0_7px_20px_-8px_rgba(245,130,31,.75)] sm:inline-flex">
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            ) : (
              <Link href="/login" aria-current={pathname === "/login" ? "page" : undefined} className={"hidden rounded-full px-5 py-2.5 text-sm font-bold transition-all sm:inline-flex " + (pathname === "/login" ? "il-nav-active text-white" : "bg-[#f5821f] text-white hover:bg-[#e77210]")}>
                Sign in
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="il-mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 xl:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {logoutError && <p role="alert" className="px-5 pb-2 text-right text-xs text-red-200">{logoutError}</p>}
        {mobileOpen && (
          <nav id="il-mobile-menu" aria-label="Mobile navigation" className="max-h-[70vh] overflow-y-auto border-t border-white/10 bg-[#0b1b3e] px-4 py-4 shadow-2xl xl:hidden">
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-1 sm:grid-cols-2">
              {[...MAIN_LINKS, ...moreLinks].map((link) => {
                const active = isActive(pathname, link.href);
                return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} onClick={() => setMobileOpen(false)} className={linkClasses(active, true)}>{link.label}</Link>;
              })}
              {account && <button type="button" onClick={signOut} className="rounded-xl px-5 py-3 text-left text-sm font-bold text-orange-200 hover:bg-white/10">Sign out</button>}
            </div>
          </nav>
        )}
      </header>
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <nav aria-label="Breadcrumb" className="mx-auto flex min-h-9 max-w-[1500px] items-center gap-2 overflow-hidden px-5 py-1 text-xs font-medium sm:px-7 lg:px-10">
          <Link href="/home" aria-label="Home" className={"inline-flex shrink-0 items-center gap-1.5 " + (pathname === "/home" ? "font-bold text-[#b45309]" : "text-slate-500 hover:text-[#b45309]")}>
            <Home className="h-3.5 w-3.5" aria-hidden="true" /> Home
          </Link>
          {pathname !== "/home" && (
            <>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
              <span aria-current="page" className="truncate font-bold text-[#0b1b3e]">{currentPage}</span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
