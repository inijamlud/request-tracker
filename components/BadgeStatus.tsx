import { getStatusColor } from "@/utils/status";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(status)}`}
    >
      {status}
    </span>
  );
}
