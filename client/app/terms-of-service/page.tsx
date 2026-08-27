import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <section className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 lg:px-10">
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          By using InternLink, you agree to use the platform responsibly and only for lawful
          purposes related to education, internships, and recruitment opportunities.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          You are responsible for the accuracy of your profile information and any content you
          submit. InternLink may update or remove content that violates platform rules or
          applicable law.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          We reserve the right to suspend or restrict access to accounts that misuse the
          platform, attempt fraud, or violate these terms.
        </p>
      </section>
      <Footer />
    </main>
  );
}
