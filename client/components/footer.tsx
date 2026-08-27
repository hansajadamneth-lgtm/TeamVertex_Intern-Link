import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Contact us", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-il-navy">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-gray-300 sm:flex-row lg:px-10">
        <p>© {new Date().getFullYear()} InternLink. All rights reserved.</p>
        <div className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
