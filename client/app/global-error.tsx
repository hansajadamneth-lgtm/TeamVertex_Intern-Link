"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            A critical error interrupted the application. You can reload the page or return to the home screen.
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-3 px-4 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#e05a28] transition-colors shadow-sm"
            >
              Try again
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
