import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RegisterCard } from "@/components/register-card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 py-16 lg:px-10">
        <div className="w-full max-w-xl">
          <RegisterCard />
        </div>
      </section>

      <Footer />
    </main>
  );
}
