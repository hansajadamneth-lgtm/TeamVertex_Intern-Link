import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <section className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 lg:px-10">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          We value your privacy and protect your personal information. InternLink uses
          your data only to provide job matching, account management, and communication
          services related to your internship and recruitment experience.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          We do not sell your personal information. We may use your email and account data
          to improve the platform, provide support, and securely manage your profile.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          By using InternLink, you agree that we may store and process your data in a secure
          environment for the purpose of delivering the services offered on this platform.
        </p>
      </section>
      <Footer />
    </main>
  );
}
