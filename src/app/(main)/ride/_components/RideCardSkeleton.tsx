export function RideCardSkeleton() {
    return (
        <div className="group bg-card/40 h-fit   rounded-2xl border border-border overflow-hidden transition-all">
            <div className="p-4 space-y-3">
                {/* Driver Info Section */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        {/* Driver Avatar Skeleton */}
                        <div className="w-12 h-12 rounded-full bg-muted-foreground/20 animate-pulse shrink-0" />
                        <div className="h-4 w-24 bg-muted-foreground/20 rounded animate-pulse" />
                    </div>
                    {/* Status Badge Skeleton */}
                    <div className="h-5 w-20 bg-muted-foreground/20 rounded-full animate-pulse shrink-0" />
                </div>

                {/* Route Section */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                        <div className="flex gap-2 w-1/3 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-foreground mt-0.5 shrink-0" />
                            <div className="h-3.5 flex-1 bg-muted-foreground/20 rounded animate-pulse" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted-foreground/20 animate-pulse shrink-0" />
                    </div>
                    <div className="ms-1 border-s-2 border-dashed border-pale-sky/40 h-3" />
                    <div className="flex gap-2 mt-2 w-2/3">
                        <div className="w-2 h-2 rounded-full bg-foreground mt-0.5 shrink-0" />
                        <div className="h-3.5 flex-1 bg-muted-foreground/20 rounded animate-pulse" />
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="flex items-center gap-2 ps-1 py-2.5 border-t border-border">
                    <div className="h-3.5 w-16 bg-muted-foreground/20 rounded animate-pulse shrink-0" />
                    <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="w-4 h-4 rounded bg-muted-foreground/20 animate-pulse shrink-0"
                            />
                        ))}
                    </div>
                </div>

                {/* Info Badges Section */}
                <div className="flex flex-wrap gap-2 mb-1">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-7 w-24 bg-muted-foreground/20 rounded-lg animate-pulse"
                        />
                    ))}
                </div>

                {/* Price and Button Section */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex gap-1 items-end">
                        <div className="h-6 w-20 bg-muted-foreground/20 rounded animate-pulse" />
                        <div className="h-2.5 w-12 bg-muted-foreground/20 rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-20 bg-muted-foreground/20 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}
