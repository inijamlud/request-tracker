"use client";

import { useEffect, useRef, useState } from "react";

type Tag = { id: string; name: string; color: string };

type Props = {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
};

const TAG_COLORS = [
  "#BFCC94",
  "#ED7D3A",
  "#93032E",
  "#00272B",
  "#6B7FD7",
  "#E8A838",
  "#3DAA7D",
  "#C084FC",
];

export default function TagSelector({ selectedTags, onChange }: Props) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [newColor, setNewColor] = useState(TAG_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then(setAllTags);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = allTags.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedTags.find((s) => s.id === t.id),
  );

  const canCreate =
    search.trim() &&
    !allTags.find((t) => t.name.toLowerCase() === search.toLowerCase());

  async function createTag() {
    setLoading(true);
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: search.trim(), color: newColor }),
    });
    const tag = await res.json();
    setAllTags((prev) => [...prev, tag]);
    onChange([...selectedTags, tag]);
    setSearch("");
    setLoading(false);
  }

  function toggleTag(tag: Tag) {
    const exists = selectedTags.find((s) => s.id === tag.id);
    if (exists) {
      onChange(selectedTags.filter((s) => s.id !== tag.id));
    } else {
      onChange([...selectedTags, tag]);
    }
  }

  return (
    <div className="relative" ref={ref}>
      {/* Selected tags + trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="min-h-[42px] w-full border border-accent/40 bg-background rounded-lg px-3 py-2 flex flex-wrap gap-1.5 cursor-pointer hover:border-accent transition"
      >
        {selectedTags.length === 0 && (
          <span className="text-sm text-primary/30 self-center">
            Select or create tags...
          </span>
        )}
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            onClick={(e) => {
              e.stopPropagation();
              toggleTag(tag);
            }}
            style={{
              background: tag.color + "22",
              borderColor: tag.color + "44",
              color: tag.color,
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer hover:opacity-70 transition"
          >
            {tag.name}
            <span className="text-[10px] ml-0.5">×</span>
          </span>
        ))}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 top-full mt-1.5 w-full bg-surface border border-accent/30 rounded-xl shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-accent/20">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search or create tag..."
              className="w-full bg-background rounded-lg px-3 py-2 text-sm text-primary placeholder-primary/30 focus:outline-none"
            />
          </div>

          {/* Existing tags */}
          <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5">
            {filtered.length === 0 && !canCreate && (
              <p className="text-xs text-primary/30 text-center py-3">
                No tags found
              </p>
            )}
            {filtered.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  toggleTag(tag);
                  setSearch("");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition text-left"
              >
                <span
                  style={{ background: tag.color }}
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                />
                <span className="text-sm text-primary">{tag.name}</span>
              </button>
            ))}
          </div>

          {/* Create new tag */}
          {canCreate && (
            <div className="border-t border-accent/20 p-2 space-y-2">
              <p className="text-xs text-primary/40 px-1">
                Create{" "}
                <span className="font-semibold text-primary">
                  &quot;{search}&quot;
                </span>
              </p>

              {/* Color picker */}
              <div className="flex gap-1.5 px-1">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    style={{ background: c }}
                    className={`w-5 h-5 rounded-full transition ${
                      newColor === c
                        ? "ring-2 ring-offset-1 ring-primary scale-110"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={createTag}
                disabled={loading}
                style={{
                  background: newColor + "22",
                  borderColor: newColor + "44",
                  color: newColor,
                }}
                className="w-full text-xs font-semibold py-2 rounded-lg border transition hover:opacity-80 disabled:opacity-50"
              >
                {loading ? "Creating..." : `+ Create "${search}"`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
