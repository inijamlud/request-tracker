"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RealtimeRequests() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    const es = new EventSource("/api/sse");

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        switch (data.type) {
          case "REQUEST_CREATED":
            showToast(`✦ New request: "${data.request.title}"`);
            router.refresh();
            break;
          case "REQUEST_UPDATED":
            showToast(`↻ Updated: "${data.request.title}"`);
            router.refresh();
            break;
          case "REQUEST_DELETED":
            showToast("✕ A request was deleted");
            router.refresh();
            break;
        }
      } catch {}
    };

    es.onerror = () => {};

    return () => es.close();
  }, [router]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-primary text-accent text-sm font-semibold px-5 py-3 rounded-xl shadow-lg border border-accent/20 whitespace-nowrap">
        {toast}
      </div>
    </div>
  );
}
