"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRequestPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validasi sederhana
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    setError("");

    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    router.push("/requests");
  }

  return (
    <div className="min-h-screen bg-[#F0F4EF] p-10">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Back */}
        <Link
          href="/requests"
          className="text-sm text-[#00272B]/50 hover:text-[#00272B] transition"
        >
          ← Back to Requests
        </Link>

        {/* Card */}
        <div className="bg-white border border-[#BFCC94]/40 rounded-2xl p-6 space-y-5">
          <h1 className="text-2xl font-bold text-[#00272B]">New Request</h1>

          <hr className="border-[#BFCC94]/30" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#00272B]">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fix login bug"
                className="w-full border border-[#BFCC94]/60 bg-[#F0F4EF] rounded-lg px-4 py-2.5 text-sm text-[#00272B] placeholder-[#00272B]/30 focus:outline-none focus:ring-2 focus:ring-[#BFCC94]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#00272B]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the request in detail..."
                rows={4}
                className="w-full border border-[#BFCC94]/60 bg-[#F0F4EF] rounded-lg px-4 py-2.5 text-sm text-[#00272B] placeholder-[#00272B]/30 focus:outline-none focus:ring-2 focus:ring-[#BFCC94] resize-none"
              />
            </div>

            {/* Error */}
            {error && <p className="text-sm text-[#93032E]">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00272B] text-[#BFCC94] font-semibold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
