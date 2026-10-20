"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Root Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          !
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Unable to load this page
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          An unexpected issue occurred while rendering this view. You can retry loading or return to the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="py-2.5 px-5 bg-[#FF6B35] text-white font-medium rounded-xl hover:bg-[#e05a28] transition-colors"
          >
            Try again
          </button>

          <Link
            href="/home"
            className="py-2.5 px-5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
