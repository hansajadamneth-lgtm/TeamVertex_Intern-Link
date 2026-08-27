import Image from "next/image";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing-navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <LandingNavbar />

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          All the jobs. One place.
        </h1>
        <p className="text-lg font-semibold text-gray-800">
          Search, build your CV, and apply with AI on your side.
        </p>

        <Image
          src="/internlink-logo.png"
          alt="InternLink"
          width={140}
          height={140}
          className="my-4 h-32 w-32 object-contain"
        />

        <p className="text-lg font-bold uppercase tracking-wide text-il-orange">
          Welcome to InternLink
        </p>

        <Link href="/register" className="mt-2 w-full max-w-md">
          <Button size="lg" className="w-full py-6 text-base">
            Create new Account
          </Button>
        </Link>
      </section>

      <Footer />
    </main>
  );
}
