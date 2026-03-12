import StatusBadge from "@/components/BadgeStatus";
import { Status } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import Link from "next/link";
import SearchInput from "./SearchInput";

type Props = {
  searchParams: { status?: string; search?: string };
};

export default async function RequestPage({ searchParams }: Props) {
  const { status, search } = await searchParams;

  const validStatuses = ["PENDING", "SUBMITTED", "DONE"];

  const requests = await prisma.request.findMany({
    where: {
      ...(status && validStatuses.includes(status)
        ? { status: status as Status }
        : {}),
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive", // case-insensitive
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#F0F4EF] p-10">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#00272B]">Requests</h1>
        <p className="text-[#00272B]/60 mt-1 mb-6">List of client requests</p>
        <Link
          href="/requests/new"
          className="inline-block bg-[#00272B] text-[#BFCC94] font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          + New Request
        </Link>

        {/* Search */}
        <div className="mt-6">
          <SearchInput />
        </div>

        {/* Filter buttons  */}
        <div className="flex gap-2 mt-6 flex-wrap">
          <Link
            href="/requests"
            className={`text-sm px-4 py-1.5 rounded-full font-semibold transition border ${
              !status
                ? "bg-[#00272B] text-[#BFCC94] border-[#00272B]"
                : "bg-white text-[#00272B]/50 border-[#BFCC94]/40 hover:border-[#00272B]/30"
            }`}
          >
            All
          </Link>

          {["PENDING", "SUBMITTED", "DONE"].map((s) => (
            <Link
              key={s}
              href={status === s ? "/requests" : `/requests?status=${s}`}
              className={`text-sm px-4 py-1.5 rounded-full font-semibold transition border ${
                status === s
                  ? "bg-[#00272B] text-[#BFCC94] border-[#00272B]"
                  : "bg-white text-[#00272B]/50 border-[#BFCC94]/40 hover:border-[#00272B]/30"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
        {/* List */}
        <ul className="mt-6 space-y-3">
          {requests.length === 0 && (
            <p className="text-[#00272B]/40 text-sm mt-10 text-center">
              No requests yet.
            </p>
          )}

          {requests.map((req) => (
            <li
              key={req.id}
              className="bg-white border border-[#BFCC94]/40 rounded-xl p-4 flex items-start justify-between gap-4 hover:shadow-sm transition"
            >
              <div className="flex-1 min-w-0">
                <Link href={`/requests/${req.id}`}>
                  <h2 className="font-semibold text-[#00272B] hover:text-[#ED7D3A] transition truncate">
                    {req.title}
                  </h2>
                </Link>
                <p className="text-sm text-[#00272B]/50 mt-0.5 line-clamp-1">
                  {req.description}
                </p>
              </div>

              <StatusBadge status={req.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
