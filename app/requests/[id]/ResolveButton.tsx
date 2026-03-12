"use client";

import {
  STATUS_BUTTON_COLOR,
  STATUS_LABEL,
  STATUS_NEXT,
  Status,
} from "@/constants/status";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResolveButton({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nextStatus = STATUS_NEXT[status];
  const label = STATUS_LABEL[status];
  const color = STATUS_BUTTON_COLOR[status];

  if (!nextStatus || !label) return null;

  async function handleClick() {
    setLoading(true);
    await fetch(`/api/requests/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full font-semibold py-2.5 rounded-xl transition disabled:opacity-50 ${color}`}
    >
      {loading ? "Updating..." : label}
    </button>
  );
}
