import { StatusHistory } from "@/lib/generated/prisma/client";

type Props = {
  history: StatusHistory[];
  createdAt: Date;
};

export default function Timeline({ history, createdAt }: Props) {
  const events = [
    {
      label: "Request Created",
      sub_label: "Status: PENDING",
      date: createdAt,
      color: "bg-accent",
    },
    ...history.map((h) => ({
      label: `Status changed to ${h.status}`,
      sub_label: null,
      date: h.createdAt,
      color:
        h.status === "DONE"
          ? "bg-status-done"
          : h.status === "SUBMITTED"
            ? "bg-status-submitted"
            : "bg-status-pending",
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-accent/20" />

      <ul className="space-y-6">
        {events.map((event, i) => (
          <li key={i} className="flex gap-4 relative">
            {/* Dot */}
            <div
              className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${event.color} ring-2 ring-background`}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary">
                {event.label}
              </p>
              {event.sub_label && (
                <p className="text-xs text-primary/40 mt-0.5">
                  {event.sub_label}
                </p>
              )}
              <p className="text-xs text-primary/30 mt-1">
                {formatDate(event.date)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
