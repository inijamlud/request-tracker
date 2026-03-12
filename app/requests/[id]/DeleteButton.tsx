"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Yakin mau hapus request ini?");
    if (!confirmed) return;

    setLoading(true);

    await fetch(`/api/requests/${id}`, {
      method: "DELETE",
    });

    router.push("/requests");
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-full border border-[#93032E] text-[#93032E] font-semibold py-2.5 rounded-xl hover:bg-[#93032E] hover:text-white transition disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete Request"}
    </button>
  );
}
