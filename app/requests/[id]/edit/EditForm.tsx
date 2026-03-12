"use client";

import TagSelector from "@/components/TagSelector";
import { PRIORITY_COLORS, PRIORITY_ORDER } from "@/constants/priority";
import { useRequestForm } from "@/hooks/useRequestForm";
import { Tag } from "@/lib/generated/prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Request = {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: Date | null;
  tags: { tag: Tag }[];
};

export default function EditForm({ request }: { request: Request }) {
  const router = useRouter();

  const { values, errors, loading, setLoading, setValue, validate } =
    useRequestForm({
      title: request.title,
      description: request.description,
      priority: request.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      dueDate: request.dueDate
        ? new Date(request.dueDate).toISOString().split("T")[0]
        : null,
    });

  const [tags, setTags] = useState<Tag[]>(request.tags.map((t) => t.tag));
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setServerError("");

    const res = await fetch(`/api/requests/${request.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setServerError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    await fetch(`/api/requests/${request.id}/tags`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagIds: tags.map((t) => t.id) }),
    });

    router.push(`/requests/${request.id}`);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background p-10">
      <div className="max-w-xl mx-auto space-y-6">
        <Link
          href={`/requests/${request.id}`}
          className="text-sm text-primary/40 hover:text-primary transition"
        >
          ← Back to Request
        </Link>

        <div className="bg-surface border border-accent/40 rounded-2xl p-6 space-y-5 mt-5">
          <h1 className="text-2xl font-bold text-primary">Edit Request</h1>
          <hr className="border-accent/20" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary/50 uppercase tracking-wider">
                Title <span className="text-danger">*</span>
              </label>
              <input
                value={values.title ?? ""}
                onChange={(e) => setValue("title", e.target.value)}
                className={`w-full border bg-background rounded-lg px-4 py-2.5 text-sm text-primary placeholder-primary/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition ${
                  errors.title ? "border-danger" : "border-accent/40"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-danger">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary/50 uppercase tracking-wider">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                value={values.description ?? ""}
                onChange={(e) => setValue("description", e.target.value)}
                rows={4}
                className={`w-full border bg-background rounded-lg px-4 py-2.5 text-sm text-primary placeholder-primary/30 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none transition ${
                  errors.description ? "border-danger" : "border-accent/40"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-danger">{errors.description}</p>
              )}
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
                    onClick={() => setValue("priority", p)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold tracking-wide transition cursor-pointer ${
                      values.priority === p
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
                value={values.dueDate ?? ""}
                onChange={(e) => setValue("dueDate", e.target.value || null)}
                className="w-full border border-accent/40 bg-background rounded-lg px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary/50 uppercase tracking-wider">
                Tags <span className="text-primary/30">(optional)</span>
              </label>
              <TagSelector selectedTags={tags} onChange={setTags} />
            </div>

            {/* Server error */}
            {serverError && (
              <p className="text-sm text-danger">{serverError}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Link
                href={`/requests/${request.id}`}
                className="flex-1 text-center border border-accent/40 text-primary/50 font-semibold py-2.5 rounded-xl hover:text-primary transition text-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-accent font-semibold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
