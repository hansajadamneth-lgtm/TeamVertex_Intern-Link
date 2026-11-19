"use client";

import { SiteNavbar } from "@/components/site-navbar";
import { StudentRouteGuard } from "@/components/student-route-guard";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="il-app min-h-screen w-full">
      <SiteNavbar />
      <div className="il-page-content w-full min-w-0 overflow-x-clip"><StudentRouteGuard>{children}</StudentRouteGuard></div>
    </div>
  );
}
