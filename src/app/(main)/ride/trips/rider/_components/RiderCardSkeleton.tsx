import { Skeleton } from "@/components/ui/skeleton";

export function RiderCardSkeleton() {
  return (
    <div className="group h-fit overflow-hidden rounded-2xl border border-border bg-card/40 transition-all">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 gap-2">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pale-sky animate-pulse" />
              <Skeleton className="h-3.5 flex-1" />
            </div>
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <div className="ms-1 h-4 border-s-2 border-dashed border-pale-sky/40" />
          <div className="flex items-start gap-2">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pale-sky animate-pulse" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-border ps-1 py-4">
          <Skeleton className="h-3.5 w-16" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-5 rounded-sm" />
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-24 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t bg-muted/20 p-4 pt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
