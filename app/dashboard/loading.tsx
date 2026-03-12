import { SkeletonCard, SkeletonLine } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonLine className="h-9 w-44" />
            <SkeletonLine className="h-4 w-28" />
          </div>
          <SkeletonLine className="h-10 w-36 rounded-xl" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonLine className="h-3 w-20" />
              <SkeletonLine className="h-10 w-16" />
            </SkeletonCard>
          ))}
        </div>

        {/* Chart */}
        <SkeletonCard>
          <SkeletonLine className="h-5 w-40 mb-4" />
          <SkeletonLine className="h-48 w-full rounded-xl" />
        </SkeletonCard>

        {/* Recent activity */}
        <SkeletonCard>
          <SkeletonLine className="h-5 w-36 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <SkeletonLine className="h-4 w-3/4" />
                  <SkeletonLine className="h-3 w-1/3" />
                </div>
                <SkeletonLine className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}
