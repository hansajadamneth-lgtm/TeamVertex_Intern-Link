import Link from "next/link";

const userPages = [
  ["Find jobs", "/job-details"],
  ["Saved jobs", "/saved-jobs"],
  ["Applications", "/applications"],
  ["AI recommendations", "/recommendations"],
  ["Notifications", "/notifications"],
  ["Cover letter", "/cover-letter"],
  ["Resume management", "/"],
  ["Profile", "/profile"],
  ["Settings", "/settings"],
];

const adminPages = [
  ["Admin dashboard", "/admin/dashboard"],
  ["Manage students", "/admin/students"],
  ["Manage companies", "/admin/companies"],
  ["Internship posts", "/admin/internship-posts"],
  ["Reports", "/admin/reports"],
];

function PageLinks({ pages }: { pages: string[][] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          className="rounded-lg border border-[#dce3eb] bg-white px-4 py-3 text-sm font-medium text-[#17233b] transition-colors hover:border-[#ff7417] hover:text-[#ff7417]"
        >
          {label}
          <span className="ml-2 text-xs text-[#98a2b3]">Open →</span>
        </Link>
      ))}
    </div>
  );
}

export function ProjectNavigation() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-8">
      <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-[#17233b]">Open project pages</h2>
        <p className="mt-1 text-sm text-[#667085]">
          Use these links to move through the complete InternLink project.
        </p>

        <h3 className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wide text-[#ff7417]">
          Student pages
        </h3>
        <PageLinks pages={userPages} />

        <h3 className="mt-7 mb-3 text-xs font-semibold uppercase tracking-wide text-[#ff7417]">
          Admin pages
        </h3>
        <PageLinks pages={adminPages} />
      </div>
    </section>
  );
}
