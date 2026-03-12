export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-primary/10 rounded-lg animate-pulse ${className}`} />
  );
}

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-accent/20 rounded-2xl p-5 space-y-3">
      {children}
    </div>
  );
}
