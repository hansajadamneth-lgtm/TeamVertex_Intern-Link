import Link from "next/link";

export default function EditProfilePage() {
  return (
    <main className="il-page-enter min-h-screen bg-[#f6f8fc] p-8">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
        <h1 className="text-2xl font-semibold text-gray-900">Edit profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Profile editing will be available here.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back to profile
        </Link>
      </section>
    </main>
  );
}