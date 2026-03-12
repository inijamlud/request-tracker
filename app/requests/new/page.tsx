"use client";

import TagSelector from "@/components/TagSelector";
import { PRIORITY_COLORS, PRIORITY_ORDER } from "@/constants/priority";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Tag = { id: string; name: string; color: string };

export default function NewRequestPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    setError("");

    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate: dueDate || null,
        tags: tags.map((t) => t.id),
      }),
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
        <div className="bg-white border border-[#BFCC94]/40 rounded-2xl p-6 space-y-5 mt-5">
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

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary/50 uppercase tracking-wider">
                Priority
              </label>
              <div className="flex gap-2">
                {PRIORITY_ORDER.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold tracking-wide transition cursor-pointer ${
                      priority === p
                        ? `${PRIORITY_COLORS[p]} border-current`
                        : "bg-background border-accent/30 text-primary/30 hover:text-primary/60"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary/50 uppercase tracking-wider">
                Due Date <span className="text-primary/30">(optional)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-accent/40 bg-background rounded-lg px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary/50 uppercase tracking-wider">
                Tags <span className="text-primary/30">(optional)</span>
              </label>
              <TagSelector selectedTags={tags} onChange={setTags} />
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
