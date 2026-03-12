import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10 space-y-4">
      <h1 className="text-3xl font-bold">Request Tracker</h1>

      <div className="space-x-4">
        <Link href="/dashboard" className="text-blue-500">
          Dashboard
        </Link>

        <Link href="/requests" className="text-blue-500">
          Requests
        </Link>
      </div>
    </main>
  );
}
