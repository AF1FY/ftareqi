"use client";

import { Button } from "@/components/ui/button";
import { PastDriverTripCard } from "../../_components/driver-past-trips-card";
import { PastDriverTripCardSkeleton } from "../../_components/driver-past-trips-card-skeleton";
import { usePastDrives } from "../../_hooks/usePastDrives";
import { Archive, Loader2 } from "lucide-react";
import { DriverPastRide } from "@/types/Ride";
import { PaginatedData } from "@/types/Moderator";

export default function Page() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = usePastDrives();

  const pastDrives =
    (data?.pages as PaginatedData<DriverPastRide>[] | undefined)?.flatMap(
      (page) => page.items ?? [],
    ) ?? [];

  return (
    <section>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <PastDriverTripCardSkeleton key={`past-drive-skeleton-${index}`} />
          ))}
        </div>
      ) : pastDrives.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-border bg-card/40 px-6 py-12 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-muted/80 text-dodger-blue">
            <Archive className="size-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            You have no past trips yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">
            Once trips are completed, they will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastDrives.map((ride) => (
              <PastDriverTripCard key={ride.rideId} ride={ride} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-full border-border bg-card px-6 py-2.5 text-foreground hover:bg-muted"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}