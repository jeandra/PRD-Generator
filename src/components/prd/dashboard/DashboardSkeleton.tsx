function SkeletonCard() {
  return (
    <div className="clay-surface-sm space-y-3 p-6">
      <div className="skeleton mb-3 h-6 w-2/3 rounded-2xl bg-[#ebdff5]" />
      <div className="skeleton mb-2 h-3.5 w-full rounded-xl bg-[#ebdff5]" />
      <div className="skeleton mb-4 h-3.5 w-4/5 rounded-xl bg-[#ebdff5]" />
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton h-4 w-24 rounded-full bg-[#ebdff5]" />
        <div className="skeleton h-4 w-16 rounded-full bg-[#ebdff5]" />
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48 rounded-2xl bg-[#ebdff5]" />
          <div className="skeleton h-4 w-64 rounded-xl bg-[#ebdff5]" />
        </div>
        <div className="skeleton h-11 w-36 rounded-full bg-[#ebdff5]" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
