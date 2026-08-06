import Link from "next/link";
import Image from "next/image";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About us", href: "#" },
  { label: "Contact us", href: "#" },
];

export function Navbar() {
  return (
    <header className="bg-il-navy">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
       <Link href="/" className="flex items-center gap-2">
        <Image src="/internlink-logo.png" alt="InternLink" width={40} height={40} 
        className="h-10 w-10 object-contain" /> 
        <span className="text-lg font-bold text-white"> Intern<span className="text-il-orange">Link</span>
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
          <Link
            href="#"
            className="text-sm font-bold text-white"
          >
            Sign In
          </Link>
        </nav>

        {/* CTA */}
        <Button className="rounded-md">Register</Button>
      </div>
    </header>
  );
}
