// utils/dueDate.ts

export type DueDateStatus =
  | { type: "overdue"; daysAgo: number }
  | { type: "today" }
  | { type: "soon"; daysLeft: number }
  | { type: "upcoming"; daysLeft: number }
  | null;

export function getDueDateStatus(
  dueDate: Date | null,
  status: string,
): DueDateStatus {
  if (!dueDate || status === "DONE") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { type: "overdue", daysAgo: Math.abs(diffDays) };
  if (diffDays === 0) return { type: "today" };
  if (diffDays <= 3) return { type: "soon", daysLeft: diffDays };
  return { type: "upcoming", daysLeft: diffDays };
}

export function getDueDateLabel(dueDateStatus: DueDateStatus): string {
  if (!dueDateStatus) return "";
  switch (dueDateStatus.type) {
    case "overdue":
      return dueDateStatus.daysAgo === 1
        ? "Overdue 1 day"
        : `Overdue ${dueDateStatus.daysAgo} days`;
    case "today":
      return "Due today";
    case "soon":
      return dueDateStatus.daysLeft === 1
        ? "1 day left"
        : `${dueDateStatus.daysLeft} days left`;
    case "upcoming":
      return `${dueDateStatus.daysLeft} days left`;
  }
}
