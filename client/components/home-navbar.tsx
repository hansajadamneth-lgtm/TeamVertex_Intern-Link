"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BriefcaseBusiness, ChevronDown, LogOut, Menu, Settings, UserRound, X, Camera } from "lucide-react";

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

type Account = { id?: string; fullName: string; email: string; role: string };

export function HomeNavbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [user, setUser] = useState<Account | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.success ? (data.user as Account) : null;
      })
      .then((account) => { if (active) setUser(account); })
      .catch(() => { if (active) setUser(null); });
    return () => { active = false; };
  }, [pathname]);

  useEffect(() => {
    if (!user) { setAvatar(null); return; }
    try { setAvatar(localStorage.getItem(`internlink-avatar-${user.id || user.email}`)); }
    catch { setAvatar(null); }
  }, [user]);

  function uploadPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setPhotoError("");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
      setPhotoError("Choose a JPG, PNG or WebP photo under 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      try {
        localStorage.setItem(`internlink-avatar-${user.id || user.email}`, reader.result);
        setAvatar(reader.result);
      } catch { setPhotoError("Could not save photo in this browser. Try a smaller image."); }
    };
    reader.readAsDataURL(file);
  }

  async function signOut() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (!response.ok) throw new Error("Sign out failed");
      setUser(null);
      setAvatar(null);
      setProfileOpen(false);
      setOpen(false);
      router.replace("/login");
      router.refresh();
    } catch { setPhotoError("Could not sign out. Please try again."); }
  }

  const initials = (user?.fullName || "Student").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const avatarView = avatar ? (
    // User-selected browser-local image; a normal img supports data URLs.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatar} alt="Your profile" className="h-full w-full rounded-full object-cover" />
  ) : (
    <span aria-hidden="true" className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-orange-300 via-orange-500 to-pink-500 text-sm font-bold text-white shadow-inner">{initials || "IL"}</span>
  );

  return (
    <header className="relative z-30 border-b border-white/10 bg-[#0b1b3e] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-10">
        <Link href="/home" className="flex shrink-0 items-center gap-2.5" aria-label="InternLink home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-sm">
            <Image src="/internlink-logo.png" alt="" width={34} height={34} className="object-contain" />
          </span>
          <span className="text-lg font-bold tracking-tight">Intern<span className="text-[#ff902e]">Link</span></span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-white ${pathname === link.href ? "bg-white/10 text-white" : "text-slate-300"}`}>{link.label}</Link>
          ))}
          <div className="relative">
            <button type="button" onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen} className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">More <ChevronDown className="h-4 w-4" /></button>
            {moreOpen && <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-slate-100 bg-white p-2 text-slate-800 shadow-2xl">
              {MORE_LINKS.map((link) => <Link key={link.href} href={link.href} onClick={() => setMoreOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-600">{link.label}</Link>)}
            </div>}
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button type="button" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen} aria-label="Open account menu" className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-3 transition hover:border-orange-300/70 hover:bg-white/15">
                <span className="h-9 w-9 overflow-hidden rounded-full">{avatarView}</span>
                <span className="hidden max-w-32 truncate text-sm font-semibold sm:block">{user.fullName.split(" ")[0]}</span>
                <ChevronDown className="h-4 w-4 text-slate-300" />
              </button>
              {profileOpen && <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-slate-100 bg-white p-3 text-slate-800 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-slate-100 px-2 pb-3 pt-1">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full">{avatarView}</span>
                  <div className="min-w-0"><p className="truncate text-sm font-bold">{user.fullName}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
                </div>
                <Link href="/profile" onClick={() => setProfileOpen(false)} className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50"><UserRound className="h-4 w-4" /> My profile</Link>
                <Link href="/profile/edit" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50"><Settings className="h-4 w-4" /> Edit profile</Link>
                <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-slate-50"><Camera className="h-4 w-4" /> Upload profile photo</button>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadPhoto} className="hidden" aria-label="Choose profile photo" />
                <p className="px-3 text-[11px] text-slate-400">Photo is saved in this browser only.</p>
                {photoError && <p role="alert" className="px-3 py-2 text-xs text-red-600">{photoError}</p>}
                <div className="my-2 border-t border-slate-100" />
                <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Log out</button>
              </div>}
            </div>
          ) : <Link href="/login" className="rounded-full bg-[#f5821f] px-5 py-2.5 text-sm font-semibold transition hover:bg-orange-400">Sign in</Link>}
          <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} className="rounded-xl border border-white/10 p-2.5 text-white transition hover:bg-white/10 lg:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {open && <nav aria-label="Mobile navigation" className="border-t border-white/10 bg-[#0b1b3e] px-5 py-3 lg:hidden">
        {[...NAV_LINKS, ...MORE_LINKS].map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm text-slate-200 hover:bg-white/10">{link.label}</Link>)}
      </nav>}
    </header>
  );
}
