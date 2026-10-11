"use client";

import { usePathname } from "next/navigation";
import { ProjectPageBar } from "@/components/project-page-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <ProjectPageBar />
      <div className={pathname === "/home" ? "" : "pl-16"}>{children}</div>
    </>
  );
}
