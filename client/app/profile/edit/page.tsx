import Link from "next/link";

export default function EditProfilePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <section className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Edit profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Profile editing will be available here.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-flex rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back to profile
        </Link>
      </section>
    </main>
  );
}