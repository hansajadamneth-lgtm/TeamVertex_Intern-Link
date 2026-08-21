import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactInfo } from "@/components/contact-info";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-10">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-il-orange">
            Contact us
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            We&apos;re Here to Help!
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 sm:text-base">
            Have a question, suggestion, or need support? Our team is always
            ready to assist you. Reach out to us anytime.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-start justify-center gap-10 lg:flex-row">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
