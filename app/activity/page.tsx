// app/activity/page.tsx
import { STATUS_COLORS } from "@/constants/status";
import prisma from "@/lib/prisma";
import Link from "next/link";

type Event = {
  id: string;
  date: Date;
  type: "created" | "status_change";
  status: string;
  requestId: string;
  requestTitle: string;
};

function groupByDay(events: Event[]) {
  const groups: Record<string, Event[]> = {};

  events.forEach((e) => {
    const key = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(e.date));

    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });

  return groups;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function isToday(date: Date) {
  const today = new Date();
  const d = new Date(date);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

function isYesterday(date: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

function friendlyDay(dateStr: string, firstDate: Date) {
  if (isToday(firstDate)) return "Today";
  if (isYesterday(firstDate)) return "Yesterday";
  return dateStr;
}

export default async function ActivityPage() {
  const [requests, history] = await Promise.all([
    prisma.request.findMany({
      select: { id: true, title: true, createdAt: true, status: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.statusHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        request: { select: { id: true, title: true } },
      },
    }),
  ]);

  // Gabung semua events: created + status changes
  const events: Event[] = [
    ...requests.map(
      (r: { id: string; title: string; createdAt: Date; status: string }) => ({
        id: `created-${r.id}`,
        date: r.createdAt,
        type: "created" as const,
        status: "PENDING",
        requestId: r.id,
        requestTitle: r.title,
      }),
    ),
    ...history.map(
      (h: {
        id: string;
        createdAt: Date;
        status: string;
        request: { id: string; title: string };
      }) => ({
        id: h.id,
        date: h.createdAt,
        type: "status_change" as const,
        status: h.status,
        requestId: h.request.id,
        requestTitle: h.request.title,
      }),
    ),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const grouped = groupByDay(events);

  return (
    <div className="min-h-screen bg-background p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Activity</h1>
          <p className="text-primary/50 mt-1">
            {events.length} events across {requests.length} requests
          </p>
        </div>

        {events.length === 0 && (
          <div className="bg-surface border border-accent/30 rounded-2xl p-10 text-center">
            <p className="text-primary/30 text-sm">No activity yet.</p>
          </div>
        )}

        {/* Timeline grouped by day */}
        {Object.entries(grouped).map(([dateStr, dayEvents]) => (
          <div key={dateStr}>
            {/* Day label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-primary/40 uppercase tracking-wider">
                {friendlyDay(dateStr, dayEvents[0].date)}
              </span>
              <div className="flex-1 h-px bg-accent/20" />
            </div>

            {/* Events */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-accent/20" />

              <ul className="space-y-5">
                {dayEvents.map((event) => (
                  <li key={event.id} className="flex gap-4 relative">
                    {/* Dot */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ring-2 ring-background ${
                        event.type === "created"
                          ? "bg-accent"
                          : event.status === "DONE"
                            ? "bg-status-done"
                            : event.status === "SUBMITTED"
                              ? "bg-status-submitted"
                              : "bg-status-pending"
                      }`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/requests/${event.requestId}`}
                          className="text-sm font-semibold text-primary hover:text-warning transition truncate block"
                        >
                          {event.requestTitle}
                        </Link>
                        <p className="text-xs text-primary/40 mt-0.5">
                          {event.type === "created"
                            ? "Request created"
                            : `Status changed to ${event.status}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Badge */}
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            STATUS_COLORS[event.status] ??
                            "bg-accent/20 text-primary"
                          }`}
                        >
                          {event.status}
                        </span>
                        {/* Time */}
                        <span className="text-xs text-primary/30">
                          {formatTime(event.date)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
