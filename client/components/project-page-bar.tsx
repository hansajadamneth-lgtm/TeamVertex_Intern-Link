import Link from "next/link";

const PAGE_LINKS = [
  ["Home", "/home"],
  ["Jobs", "/job-details"],
  ["CV builder", "/"],
  ["Saved jobs", "/saved-jobs"],
  ["Applications", "/applications"],
  ["Recommendations", "/recommendations"],
  ["Notifications", "/notifications"],
  ["Cover letter", "/cover-letter"],
  ["Profile", "/profile"],
  ["Edit profile", "/profile/edit"],
  ["Settings", "/settings"],
  ["Admin dashboard", "/admin/dashboard"],
  ["Students", "/admin/students"],
  ["Companies", "/admin/companies"],
  ["Internship posts", "/admin/internship-posts"],
  ["Add internship", "/admin/internship-posts/add"],
  ["Reports", "/admin/reports"],
  ["Manage companies", "/manage-companies"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Login", "/login"],
  ["Register", "/register"],
  ["Forgot password", "/forgot-password"],
  ["Terms", "/terms-of-service"],
  ["Privacy", "/privacy-policy"],
];

export function ProjectPageBar() {
  return (
    <nav
      aria-label="All project pages"
      className="border-b border-[#e5e7eb] bg-white shadow-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-5 py-2 scrollbar-none lg:px-8">
        <span className="sticky left-0 shrink-0 bg-white pr-2 text-[10px] font-semibold uppercase tracking-wide text-[#98a2b3]">
          Pages
        </span>
        {PAGE_LINKS.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="shrink-0 rounded-full border border-[#e5e7eb] px-3 py-1.5 text-[11px] font-medium text-[#475467] transition-colors hover:border-il-orange hover:bg-[#fff7f1] hover:text-il-orange"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
