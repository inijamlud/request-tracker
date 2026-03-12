export const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-primary/10 text-primary/50",
  MEDIUM: "bg-accent/20 text-primary",
  HIGH: "bg-warning/20 text-warning",
  CRITICAL: "bg-danger/20 text-danger",
};

export const PRIORITY_ORDER = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type Priority = (typeof PRIORITY_ORDER)[number];
