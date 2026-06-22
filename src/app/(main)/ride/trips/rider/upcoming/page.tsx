"use client";

import { useState } from "react";
import { Car, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiderCard } from "../_components/RiderCard";
import { RiderCardSkeleton } from "../_components/RiderCardSkeleton";
import {
  RiderUpcomingFilter,
  FILTER_OPTIONS,
  useRiderUpcomingTrips,
} from "../_hooks/useRiderUpcomingTrips";
import ModernCarIcon from "@/components/svg/ModernCarIcon";

function EmptyUpcomingTripsState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl px-6 py-12 text-center">
      <div className="relative mb-5 flex size-16 items-center justify-center rounded-full bg-pale-sky/10">
        <ModernCarIcon className="size-8 text-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground md:text-2xl">
        No upcoming trips
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You do not have any upcoming rides in this filter right now.
      </p>
    </div>
  );
}

export default function RiderUpcomingTripsPage() {
  const [filter, setFilter] = useState<RiderUpcomingFilter>(
    "All" as RiderUpcomingFilter,
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useRiderUpcomingTrips(filter);

  const trips = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  const handleRefresh = () => {
    void refetch();
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex gap-1.5 items-center self-end">
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as RiderUpcomingFilter)}
        >
          <SelectTrigger className="h-10 w-full sm:w-38">
            <SelectValue placeholder="Filter trips" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
        <EmptyUpcomingTripsState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <RiderCard key={trip.bookingId} trip={trip} rideCardType="Upcoming" />
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
