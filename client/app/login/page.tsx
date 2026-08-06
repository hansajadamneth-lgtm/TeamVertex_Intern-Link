import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LoginCard } from "@/components/login-card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-24">
        <Hero />
        <LoginCard />
      </section>

      <Footer />
    </main>
  );
}
