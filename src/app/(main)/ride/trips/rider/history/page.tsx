"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiderCard } from "../_components/RiderCard";
import { RiderCardSkeleton } from "../_components/RiderCardSkeleton";
import {
  useRiderHistoryTrips,
} from "../_hooks/useRiderHistoryTrips";
import ModernCarIcon from "@/components/svg/ModernCarIcon";

function EmptyPastTripsState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl px-6 py-12 text-center">
      <div className="relative mb-5 flex size-16 items-center justify-center rounded-full bg-pale-sky/10">
        <ModernCarIcon className="size-8 text-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground md:text-2xl">
        No past trips
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You do not have any past rides in this filter right now.
      </p>
    </div>
  );
}

export default function RiderPastTripsPage() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useRiderHistoryTrips();

  const trips = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  const handleRefresh = () => {
    void refetch();
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex gap-1.5 items-center self-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={handleRefresh}
          aria-label="Refresh trips"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading || isRefetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <RiderCardSkeleton
              key={`rider-upcoming-skeleton-${index}`}
            />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <EmptyPastTripsState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <RiderCard key={trip.bookingId} trip={trip} rideCardType="History" />
            ))}
          </div>

          {hasNextPage ? (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                className="min-w-40"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
