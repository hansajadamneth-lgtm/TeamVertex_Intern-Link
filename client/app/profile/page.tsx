import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <section className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your InternLink profile and application details.
        </p>
        <Link
          href="/profile/edit"
          className="mt-6 inline-flex rounded-lg bg-[#ff7417] px-5 py-3 text-sm font-semibold text-white hover:bg-[#e4640e]"
        >
          Edit profile
        </Link>
      </section>
    </main>
  );
}