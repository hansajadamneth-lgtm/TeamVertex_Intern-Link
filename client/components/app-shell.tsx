"use client";

import { SiteNavbar } from "@/components/site-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="il-app min-h-screen w-full overflow-x-clip">
      <SiteNavbar />
      <div className="il-page-content w-full">{children}</div>
    </div>
  );
}
