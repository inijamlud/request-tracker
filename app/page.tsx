// app/page.tsx
import { VALID_STATUSES } from "@/constants/status";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const [total, counts] = await Promise.all([
    prisma.request.count(),
    prisma.request.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const statCards = VALID_STATUSES.map((s) => ({
    status: s,
    count:
      counts.find((c: { status: string }) => c.status === s)?._count.status ??
      0,
  }));

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-10 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          Simple. Focused. Trackable.
        </div>

        <h1 className="text-5xl font-bold text-primary leading-tight">
          Manage client requests <br />
          <span className="text-warning">without the chaos.</span>
        </h1>

        <p className="text-primary/50 mt-4 text-lg max-w-xl mx-auto">
          Request Tracker helps you log, monitor, and resolve requests — from
          submission to done.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="/requests/new"
            className="bg-primary text-accent font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition"
          >
            + New Request
          </Link>
          <Link
            href="/dashboard"
            className="bg-white border border-accent/40 text-primary font-semibold px-6 py-3 rounded-xl hover:shadow-sm transition"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-10 pb-16">
        <div className="grid grid-cols-4 gap-4">
          {/* Total */}
          <div className="bg-primary text-accent rounded-2xl p-5 col-span-1">
            <p className="text-accent/60 text-xs font-semibold uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-4xl font-bold">{total}</p>
            <p className="text-accent/50 text-xs mt-1">all requests</p>
          </div>

          {/* Per status */}
          {statCards.map(({ status, count }) => (
            <Link
              key={status}
              href={`/requests?status=${status}`}
              className="bg-white border border-accent/30 rounded-2xl p-5 hover:shadow-sm hover:border-accent transition group"
            >
              <p className="text-primary/40 text-xs font-semibold uppercase tracking-wider mb-1">
                {status}
              </p>
              <p className="text-4xl font-bold text-primary group-hover:text-warning transition">
                {count}
              </p>
              <p className="text-primary/30 text-xs mt-1">requests</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-10 pb-20">
        <h2 className="text-lg font-bold text-primary mb-4">How it works</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Submit",
              desc: "Create a new request with title and description.",
            },
            {
              step: "02",
              title: "Track",
              desc: "Monitor status as it moves from Pending to Submitted.",
            },
            {
              step: "03",
              title: "Done",
              desc: "Mark resolved requests as Done and keep records clean.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="bg-white border border-accent/30 rounded-2xl p-5 space-y-2"
            >
              <span className="text-xs font-bold text-accent bg-primary px-2 py-0.5 rounded-md">
                {step}
              </span>
              <h3 className="font-bold text-primary">{title}</h3>
              <p className="text-sm text-primary/50">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
