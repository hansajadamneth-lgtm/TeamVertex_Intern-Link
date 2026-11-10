"use client";

import { ProjectPageBar } from "@/components/project-page-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="il-app min-h-screen w-full overflow-x-clip">
      <ProjectPageBar />
      <div className="w-full">{children}</div>
    </div>
  );
}
