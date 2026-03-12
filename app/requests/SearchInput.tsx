"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    // Debounce — tunggu 400ms setelah user berhenti ngetik
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }

      router.push(`/requests?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [router, searchParams, value]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search by title..."
      className="w-full border border-[#BFCC94]/60 bg-white rounded-lg px-4 py-2.5 text-sm text-[#00272B] placeholder-[#00272B]/30 focus:outline-none focus:ring-2 focus:ring-[#BFCC94]"
    />
  );
}
