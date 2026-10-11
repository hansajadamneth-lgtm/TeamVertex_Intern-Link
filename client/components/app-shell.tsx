"use client";

import { ProjectPageBar } from "@/components/project-page-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectPageBar />
      <div>{children}</div>
    </>
  );
}
