import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-10">
      <div className="w-14 h-14 rounded-2xl bg-surface border border-accent/20 flex items-center justify-center text-2xl mb-4">
        🔍
      </div>
      <h1 className="text-xl font-bold text-primary">Page not found</h1>
      <p className="text-primary/40 text-sm mt-2 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="bg-primary text-accent font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition text-sm"
      >
        Go Home
      </Link>
    </div>
  );
}
