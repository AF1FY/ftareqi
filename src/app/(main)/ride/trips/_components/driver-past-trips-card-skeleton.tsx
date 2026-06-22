export function PastDriverTripCardSkeleton() {
    return (
        <div className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/40 p-4 transition-all">
            <div className="flex w-full items-center justify-between">
                <div className="h-6 w-20 rounded-full bg-muted-foreground/15 animate-pulse" />
                <div className="h-4 w-24 rounded bg-muted-foreground/15 animate-pulse" />
            </div>

            <div className="relative w-full space-y-3">
                <div className="flex items-center gap-3">
                    <div className="size-2.5 shrink-0 rounded-full border-2 border-foreground bg-background" />
                    <div className="h-4 flex-1 rounded bg-muted-foreground/15 animate-pulse" />
                </div>

                <div className="ms-1 h-6 border-s-2 border-dashed border-border" />

                <div className="flex items-center gap-3">
                    <div className="size-2.5 shrink-0 rounded-full bg-foreground" />
                    <div className="h-4 flex-1 rounded bg-muted-foreground/15 animate-pulse" />
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <div className="h-9 w-28 rounded-lg bg-muted-foreground/15 animate-pulse" />
                <div className="h-9 w-24 rounded-lg bg-muted-foreground/15 animate-pulse" />
                <div className="h-9 w-28 rounded-lg bg-muted-foreground/15 animate-pulse" />
            </div>

            <div className="flex w-full items-center justify-between border-t border-border pt-4">
                <div className="space-y-2">
                    <div className="h-8 w-28 rounded bg-muted-foreground/15 animate-pulse" />
                    <div className="h-4 w-14 rounded bg-muted-foreground/15 animate-pulse" />
                </div>
                <div className="h-9 w-28 rounded-full bg-muted-foreground/15 animate-pulse" />
            </div>
        </div>
    );
}