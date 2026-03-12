import StatusBadge from "@/components/BadgeStatus";
import DueDateBadge from "@/components/DueDateBadge";
import Pagination from "@/components/Pagination";
import PriorityBadge from "@/components/PriorityBadge";
import RealtimeRequests from "@/components/RealtimeRequests";
import ViewToggle from "@/components/ViewToggle";
import { Status } from "@/constants/status";
import prisma from "@/lib/prisma";
import Link from "next/link";
import SearchInput from "./SearchInput";

type ViewMode = "compact" | "card" | "table";

const PER_PAGE = 10;

type Props = {
  searchParams: Promise<{
    status?: string;
    search?: string;
    tag?: string | string[];
    view?: string;
    page?: string;
  }>;
};

export default async function RequestPage({ searchParams }: Props) {
  const { status, search, tag, view, page } = await searchParams;

  const currentPage = Math.max(1, parseInt(page ?? "1"));
  const viewMode: ViewMode =
    view === "card" || view === "table" ? view : "compact";
  const activeTags: string[] = tag ? (Array.isArray(tag) ? tag : [tag]) : [];
  const validStatuses = ["PENDING", "SUBMITTED", "DONE"];

  const where = {
    ...(status && validStatuses.includes(status)
      ? { status: status as Status }
      : {}),
    ...(search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(activeTags.length > 0
      ? {
          AND: activeTags.map((t) => ({
            tags: { some: { tag: { name: t } } },
          })),
        }
      : {}),
  };

  const [requests, total, allTags] = await Promise.all([
    prisma.request.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { tags: { include: { tag: true } } },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.request.count({ where }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="min-h-screen bg-background p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Requests</h1>

            <p className="text-primary/50 mt-1">
              {total} requests · page {currentPage} of {totalPages || 1}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle current={viewMode} />
            <Link
              href="/requests/new"
              className="bg-primary text-accent font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition text-sm"
            >
              + New Request
            </Link>
          </div>
        </div>

        {/* Search */}
        <SearchInput />

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          <Link
            href={`/requests?view=${viewMode}${tag ? `&tag=${activeTags.join("&tag=")}` : ""}`}
            className={`text-sm px-4 py-1.5 rounded-full font-semibold transition border ${
              !status
                ? "bg-primary text-accent border-primary"
                : "bg-surface text-primary/50 border-accent/40 hover:border-primary/30"
            }`}
          >
            All
          </Link>
          {["PENDING", "SUBMITTED", "DONE"].map((s) => {
            const params = new URLSearchParams();
            params.set("view", viewMode);
            if (search) params.set("search", search);
            activeTags.forEach((t) => params.append("tag", t));
            if (status !== s) params.set("status", s);
            return (
              <Link
                key={s}
                href={`/requests?${params.toString()}`}
                className={`text-sm px-4 py-1.5 rounded-full font-semibold transition border ${
                  status === s
                    ? "bg-primary text-accent border-primary"
                    : "bg-surface text-primary/50 border-accent/40 hover:border-primary/30"
                }`}
              >
                {s}
              </Link>
            );
          })}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-primary/30 font-semibold uppercase tracking-wider">
              Tags:
            </span>
            {allTags.map((t) => {
              const isActive = activeTags.includes(t.name);
              const nextTags = isActive
                ? activeTags.filter((a) => a !== t.name)
                : [...activeTags, t.name];
              const params = new URLSearchParams();
              params.set("view", viewMode);
              if (search) params.set("search", search);
              if (status) params.set("status", status);
              nextTags.forEach((nt) => params.append("tag", nt));
              return (
                <Link
                  key={t.id}
                  href={`/requests?${params.toString()}`}
                  style={
                    isActive
                      ? {
                          background: t.color + "33",
                          borderColor: t.color,
                          color: t.color,
                        }
                      : { borderColor: t.color + "44", color: t.color + "88" }
                  }
                  className="text-xs font-semibold px-3 py-1 rounded-full border transition hover:opacity-100"
                >
                  {isActive && <span className="mr-1">✓</span>}# {t.name}
                </Link>
              );
            })}
            {activeTags.length > 0 && (
              <Link
                href={`/requests?view=${viewMode}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                className="text-xs text-primary/30 hover:text-danger transition"
              >
                clear tags
              </Link>
            )}
          </div>
        )}

        {/* ====== COMPACT MODE ====== */}
        {viewMode === "compact" && (
          <div className="bg-surface border border-accent/20 rounded-2xl overflow-hidden">
            {requests.length === 0 && (
              <p className="text-primary/30 text-sm text-center py-16">
                No requests found.
              </p>
            )}
            {requests.map((req, i) => (
              <Link
                key={req.id}
                href={`/requests/${req.id}`}
                className={`flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition group ${
                  i < requests.length - 1 ? "border-b border-accent/10" : ""
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    req.status === "DONE"
                      ? "bg-status-done"
                      : req.status === "SUBMITTED"
                        ? "bg-status-submitted"
                        : "bg-status-pending"
                  }`}
                />
                <span className="flex-1 text-sm font-medium text-primary group-hover:text-warning transition truncate">
                  {req.title}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  {req.tags.slice(0, 2).map(({ tag: t }) => (
                    <span
                      key={t.id}
                      style={{
                        background: t.color + "22",
                        borderColor: t.color + "33",
                        color: t.color,
                      }}
                      className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded-full border"
                    >
                      {t.name}
                    </span>
                  ))}
                  {req.tags.length > 2 && (
                    <span className="text-xs text-primary/25">
                      +{req.tags.length - 2}
                    </span>
                  )}
                  <DueDateBadge dueDate={req.dueDate} status={req.status} />
                  <span
                    className={`text-xs font-bold w-16 text-right ${
                      req.priority === "CRITICAL"
                        ? "text-danger"
                        : req.priority === "HIGH"
                          ? "text-warning"
                          : req.priority === "MEDIUM"
                            ? "text-accent"
                            : "text-primary/25"
                    }`}
                  >
                    {req.priority}
                  </span>
                  <span className="text-xs text-primary/25 w-16 text-right hidden md:block">
                    {new Date(req.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ====== CARD MODE ====== */}
        {viewMode === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.length === 0 && (
              <p className="text-primary/30 text-sm col-span-3 text-center py-16">
                No requests found.
              </p>
            )}
            {requests.map((req) => (
              <Link
                key={req.id}
                href={`/requests/${req.id}`}
                className="bg-surface border border-accent/20 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-accent/40 transition group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <StatusBadge status={req.status} />
                  <PriorityBadge priority={req.priority} />
                </div>

                {/* Title */}
                <h2 className="font-semibold text-primary group-hover:text-warning transition line-clamp-2 text-sm leading-snug">
                  {req.title}
                </h2>

                {/* Description */}
                <p className="text-xs text-primary/40 line-clamp-2 flex-1">
                  {req.description}
                </p>

                {/* Tags */}
                {req.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {req.tags.slice(0, 3).map(({ tag: t }) => (
                      <span
                        key={t.id}
                        style={{
                          background: t.color + "22",
                          borderColor: t.color + "33",
                          color: t.color,
                        }}
                        className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                      >
                        {t.name}
                      </span>
                    ))}
                    {req.tags.length > 3 && (
                      <span className="text-xs text-primary/25 px-2 py-0.5 rounded-full border border-primary/10">
                        +{req.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-accent/10">
                  <DueDateBadge dueDate={req.dueDate} status={req.status} />
                  <span className="text-xs text-primary/25">
                    {new Date(req.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ====== TABLE MODE ====== */}
        {viewMode === "table" && (
          <div className="bg-surface border border-accent/20 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-accent/20">
                  {[
                    "Title",
                    "Status",
                    "Priority",
                    "Tags",
                    "Due Date",
                    "Created",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-primary/30 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-primary/30 text-sm py-16"
                    >
                      No requests found.
                    </td>
                  </tr>
                )}
                {requests.map((req, i) => (
                  <tr
                    key={req.id}
                    className={`group hover:bg-primary/5 transition ${
                      i < requests.length - 1 ? "border-b border-accent/10" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/requests/${req.id}`}
                        className="font-medium text-primary group-hover:text-warning transition truncate block max-w-xs"
                      >
                        {req.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-3">
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {req.tags.slice(0, 2).map(({ tag: t }) => (
                          <span
                            key={t.id}
                            style={{
                              background: t.color + "22",
                              borderColor: t.color + "33",
                              color: t.color,
                            }}
                            className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                          >
                            {t.name}
                          </span>
                        ))}
                        {req.tags.length > 2 && (
                          <span className="text-xs text-primary/25">
                            +{req.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <DueDateBadge dueDate={req.dueDate} status={req.status} />
                    </td>
                    <td className="px-5 py-3 text-xs text-primary/30 whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={{ status, search, tag, view }}
        />
      </div>

      <RealtimeRequests />
    </div>
  );
}
