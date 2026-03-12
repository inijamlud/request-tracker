import { PRIORITY_COLORS } from "@/constants/priority";

export default function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_COLORS[priority]}`}
    >
      {priority}
    </span>
  );
}
