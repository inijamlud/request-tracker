import { STATUS_COLORS } from "@/constants/status";

export function getStatusColor(status: string) {
  return STATUS_COLORS[status] ?? "bg-gray-200 text-gray-700";
}
