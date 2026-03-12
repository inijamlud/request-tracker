import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
};

export default function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: Props) {
  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, val]) => {
      if (key === "page") return;
      if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
      else if (val) params.set(key, val);
    });
    params.set("page", String(page));
    return `/requests?${params.toString()}`;
  }

  function getPages() {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="flex items-center justify-between pt-2">
      {/* Info */}
      <p className="text-xs text-primary/30">
        Page {currentPage} of {totalPages}
      </p>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="px-3 py-1.5 rounded-lg text-sm text-primary/50 hover:text-primary hover:bg-accent/10 transition"
          >
            ←
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg text-sm text-primary/20 cursor-not-allowed">
            ←
          </span>
        )}

        {/* Page numbers */}
        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-sm text-primary/20">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={buildUrl(page as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                currentPage === page
                  ? "bg-primary text-accent"
                  : "text-primary/50 hover:text-primary hover:bg-accent/10"
              }`}
            >
              {page}
            </Link>
          ),
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="px-3 py-1.5 rounded-lg text-sm text-primary/50 hover:text-primary hover:bg-accent/10 transition"
          >
            →
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg text-sm text-primary/20 cursor-not-allowed">
            →
          </span>
        )}
      </div>
    </div>
  );
}
