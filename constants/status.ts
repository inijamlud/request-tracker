// constants/status.ts

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-status-pending text-primary",
  SUBMITTED: "bg-status-submitted text-white",
  DONE: "bg-status-done text-white",
};

export const STATUS_BUTTON_COLOR: Record<string, string> = {
  PENDING: "bg-status-pending text-primary hover:opacity-90",
  SUBMITTED: "bg-status-submitted text-white hover:opacity-90",
  DONE: "",
};

export const STATUS_NEXT: Record<string, string | null> = {
  PENDING: "SUBMITTED",
  SUBMITTED: "DONE",
  DONE: null,
};

export const STATUS_LABEL: Record<string, string | null> = {
  PENDING: "Submit Request",
  SUBMITTED: "Mark as Done",
  DONE: null,
};

export const VALID_STATUSES = ["PENDING", "SUBMITTED", "DONE"] as const;
export type Status = (typeof VALID_STATUSES)[number];
