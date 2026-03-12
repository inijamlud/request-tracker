import StatusBadge from "@/components/BadgeStatus";
import { VALID_STATUSES } from "@/constants/status";
import prisma from "@/lib/prisma";
import Link from "next/link";
import StatusChart from "./StatusChart";

export default async function DashboardPage() {
  const [counts, recentRequests, total] = await Promise.all([
    prisma.request.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.request.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.request.count(),
  ]);

  const chartData = VALID_STATUSES.map((s) => ({
    status: s,
    count: counts.find((c) => c.status === s)?._count.status ?? 0,
  }));

  const statCards = VALID_STATUSES.map((s) => ({
    status: s,
    count: counts.find((c) => c.status === s)?._count.status ?? 0,
  }));

  return (
    <div className="min-h-screen bg-[#F0F4EF] p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#00272B]">Dashboard</h1>
            <p className="text-[#00272B]/50 mt-1">{total} total request</p>
          </div>
          <Link
            href="/requests/new"
            className="bg-[#00272B] text-[#BFCC94] font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition"
          >
            + New Request
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4">
          {statCards.map(({ status, count }) => (
            <Link
              key={status}
              href={`/requests?status=${status}`}
              className="bg-white border border-[#BFCC94]/40 rounded-2xl p-5 hover:shadow-sm transition group"
            >
              <p className="text-sm text-[#00272B]/50 font-medium mb-2">
                {status}
              </p>
              <p className="text-4xl font-bold text-[#00272B] group-hover:text-[#ED7D3A] transition">
                {count}
              </p>
            </Link>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white border border-[#BFCC94]/40 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#00272B] mb-6">
            Requests by Status
          </h2>
          <StatusChart data={chartData} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-[#BFCC94]/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#00272B]">
              Recent Activity
            </h2>
            <Link
              href="/requests"
              className="text-sm text-[#00272B]/40 hover:text-[#ED7D3A] transition"
            >
              View all →
            </Link>
          </div>

          <ul className="space-y-3">
            {recentRequests.length === 0 && (
              <p className="text-sm text-[#00272B]/30 text-center py-4">
                No requests yet.
              </p>
            )}
            {recentRequests.map((req) => (
              <li key={req.id}>
                <Link
                  href={`/requests/${req.id}`}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-[#F0F4EF] transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#00272B] truncate">
                      {req.title}
                    </p>
                    <p className="text-xs text-[#00272B]/40 mt-0.5">
                      {new Date(req.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
