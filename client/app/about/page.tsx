import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutHero } from "@/components/about-us";
import { WhyChooseSection } from "@/components/why-choose-section";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-10">
        <AboutHero />
        <WhyChooseSection />
      </section>

      <Footer />
    </main>
  );
}