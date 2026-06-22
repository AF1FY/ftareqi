export function UpcomingCardSkeleton() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-4">
            <div className="flex items-center justify-between">
                <div className="h-6 w-20 rounded-full bg-muted-foreground/15 animate-pulse" />
                <div className="h-4 w-24 rounded bg-muted-foreground/15 animate-pulse" />
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-foreground/70" />
                    <div className="h-4 flex-1 rounded bg-muted-foreground/15 animate-pulse" />
                </div>
                <div className="ml-1 h-4 border-l border-dashed border-border" />
                <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-foreground/70" />
                    <div className="h-4 flex-1 rounded bg-muted-foreground/15 animate-pulse" />
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <div className="h-9 w-28 rounded-lg bg-muted-foreground/15 animate-pulse" />
                <div className="h-9 w-32 rounded-lg bg-muted-foreground/15 animate-pulse" />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="space-y-2">
                    <div className="h-8 w-28 rounded bg-muted-foreground/15 animate-pulse" />
                    <div className="h-4 w-14 rounded bg-muted-foreground/15 animate-pulse" />
                </div>
                <div className="h-11 w-32 rounded-full bg-muted-foreground/15 animate-pulse" />
            </div>
        </div>
    );
}