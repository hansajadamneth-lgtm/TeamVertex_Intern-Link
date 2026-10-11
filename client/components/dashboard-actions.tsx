import Link from "next/link";

const primaryActions = [
  ["Find jobs", "/job-details"],
  ["Saved jobs", "/saved-jobs"],
  ["Applications", "/applications"],
  ["Recommendations", "/recommendations"],
  ["Notifications", "/notifications"],
  ["AI cover letter", "/cover-letter"],
  ["Resume management", "/"],
  ["Profile", "/profile"],
  ["Settings", "/settings"],
];

const adminActions = [
  ["Admin dashboard", "/admin/dashboard"],
  ["Manage students", "/admin/students"],
  ["Manage companies", "/admin/companies"],
  ["Internship posts", "/admin/internship-posts"],
  ["Reports", "/admin/reports"],
];

export function DashboardActions() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-6 lg:px-8">
      <div className="rounded-xl border border-[#dce3eb] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#17233b]">Your dashboard</h2>
            <p className="mt-1 text-xs text-[#667085]">
              Open any InternLink feature from one place.
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="rounded-full bg-[#0b142b] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#182647]"
          >
            Open admin dashboard
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {primaryActions.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-[#e2e8f0] px-3 py-3 text-center text-xs font-semibold text-[#17233b] transition-colors hover:border-[#ff7417] hover:bg-[#fff8f3] hover:text-[#e86b18]"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="mt-6 border-t border-[#eef2f6] pt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#ff7417]">
            Admin pages
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {adminActions.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg bg-[#f8fafc] px-3 py-3 text-center text-xs font-medium text-[#475467] transition-colors hover:bg-[#fff0e5] hover:text-[#e86b18]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
