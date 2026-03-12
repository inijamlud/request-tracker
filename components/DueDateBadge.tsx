import { getDueDateLabel, getDueDateStatus } from "@/utils/dueDate";

type Props = {
  dueDate: Date | null;
  status: string;
};

const STYLES = {
  overdue: "bg-danger/15 text-danger border border-danger/30",
  today: "bg-warning/15 text-warning border border-warning/30",
  soon: "bg-warning/10 text-warning border border-warning/20",
  upcoming: "bg-primary/5 text-primary/40 border border-primary/10",
};

const ICONS = {
  overdue: "🔴",
  today: "🟠",
  soon: "🟡",
  upcoming: "📅",
};

export default function DueDateBadge({ dueDate, status }: Props) {
  const dueDateStatus = getDueDateStatus(dueDate, status);
  if (!dueDateStatus) return null;

  const label = getDueDateLabel(dueDateStatus);
  const style = STYLES[dueDateStatus.type];
  const icon = ICONS[dueDateStatus.type];

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${style}`}
    >
      <span className="text-[10px]">{icon}</span>
      {label}
    </span>
  );
}
