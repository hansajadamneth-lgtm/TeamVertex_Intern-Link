import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-6xl font-black text-[#FF6B35] mb-2 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">
          The requested page could not be found or may have been relocated.
        </p>
        <Link
          href="/home"
          className="inline-block px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#e05a28] transition-colors shadow-sm"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}
