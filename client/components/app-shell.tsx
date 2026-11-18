"use client";

import { SiteNavbar } from "@/components/site-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="il-app min-h-screen w-full">
      <SiteNavbar />
      <div className="il-page-content w-full min-w-0 overflow-x-clip">{children}</div>
    </div>
  );
}
