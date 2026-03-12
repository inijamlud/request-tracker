"use client";

import { useRouter, useSearchParams } from "next/navigation";

type ViewMode = "compact" | "card" | "table";

const MODES: { mode: ViewMode; icon: string; label: string }[] = [
  { mode: "card", icon: "⊞", label: "Card" },
  { mode: "table", icon: "▦", label: "Table" },
  { mode: "compact", icon: "☰", label: "Compact" },
];

export default function ViewToggle({ current }: { current: ViewMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function switchMode(mode: ViewMode) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    router.push(`/requests?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-0.5 bg-primary/5 border border-accent/20 rounded-lg p-0.5">
      {MODES.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => switchMode(mode)}
          title={label}
          className={`px-3 py-1.5 rounded-md text-sm transition cursor-pointer ${
            current === mode
              ? "bg-surface text-primary shadow-sm font-semibold"
              : "text-primary/30 hover:text-primary"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
