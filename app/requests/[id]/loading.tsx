import { SkeletonCard, SkeletonLine } from "@/components/Skeleton";

export default function RequestDetailLoading() {
  return (
    <div className="min-h-screen bg-background p-10">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Back */}
        <SkeletonLine className="h-4 w-28" />

        {/* Detail card */}
        <SkeletonCard>
          <div className="flex items-start justify-between gap-4">
            <SkeletonLine className="h-7 w-2/3" />
            <SkeletonLine className="h-6 w-20 rounded-full" />
          </div>
          <SkeletonLine className="h-px w-full" />
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-4/5" />
          <SkeletonLine className="h-4 w-1/2" />
          <SkeletonLine className="h-3 w-32" />
        </SkeletonCard>

        {/* Timeline card */}
        <SkeletonCard>
          <SkeletonLine className="h-4 w-20 mb-4" />
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <SkeletonLine className="w-3.5 h-3.5 rounded-full shrink-0 mt-1" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonLine className="h-4 w-1/2" />
                  <SkeletonLine className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Action buttons */}
        <SkeletonLine className="h-11 w-full rounded-xl" />
        <SkeletonLine className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
