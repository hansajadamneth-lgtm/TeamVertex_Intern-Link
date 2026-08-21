import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About us", href: "#" },
  { label: "Contact us", href: "#" },
];

const NAV_LINK_CLASS = "text-sm text-gray-200 transition-colors hover:text-white";

export function Navbar() {
  return (
    <header className="bg-il-navy">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-white">
            <Image
              src="/internlink-logo.png"
              alt="InternLink"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-lg font-bold text-white">
            Intern<span className="text-il-orange">Link</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden flex-1 items-center justify-evenly md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className={NAV_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
          <Link href="#" className={NAV_LINK_CLASS}>
            Sign In
          </Link>
          <Link href="#" className={NAV_LINK_CLASS}>
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
