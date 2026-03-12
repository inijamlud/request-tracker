// app/error.tsx — global error boundary
"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-10">
      <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-2xl mb-4">
        ⚠️
      </div>
      <h1 className="text-xl font-bold text-primary">Something went wrong</h1>
      <p className="text-primary/40 text-sm mt-2 mb-6 max-w-sm">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-primary text-accent font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition text-sm"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-accent/40 text-primary font-semibold px-5 py-2 rounded-xl hover:bg-accent/10 transition text-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
