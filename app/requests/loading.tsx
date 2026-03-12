import { SkeletonCard, SkeletonLine } from "@/components/Skeleton";

export default function RequestsLoading() {
  return (
    <div className="min-h-screen bg-background p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonLine className="h-8 w-40" />
            <SkeletonLine className="h-4 w-24" />
          </div>
          <SkeletonLine className="h-10 w-32 rounded-xl" />
        </div>

        {/* Search skeleton */}
        <SkeletonLine className="h-10 w-full rounded-lg" />

        {/* Filter pills skeleton */}
        <div className="flex gap-2">
          {[80, 100, 110, 90].map((w, i) => (
            <SkeletonLine key={i} className={`h-8 w-${w} rounded-full`} />
          ))}
        </div>

        {/* List skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <SkeletonLine className="h-4 w-3/4" />
                  <SkeletonLine className="h-3 w-1/2" />
                </div>
                <SkeletonLine className="h-6 w-20 rounded-full" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  );
}
