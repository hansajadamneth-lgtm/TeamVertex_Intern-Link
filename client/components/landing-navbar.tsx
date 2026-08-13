import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Find jobs", href: "#" },
  { label: "cv builder", href: "#" },
  { label: "Recommendation", href: "#" },
  { label: "Saved", href: "#" },
];

export function LandingNavbar() {
  return (
    <header className="bg-il-navy">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Image
              src="/internlink-logo.png"
              alt="InternLink"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-gray-200 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Button className="rounded-md">Sign In</Button>
      </div>
    </header>
  );
}
