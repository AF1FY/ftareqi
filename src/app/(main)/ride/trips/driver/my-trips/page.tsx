"use client";

import { Button } from "@/components/ui/button";
import DriverRideCard from "../../_components/upcoming-card";
import { UpcomingCardSkeleton } from "../../_components/upcoming-card-skeleton";
import { useUpcomingDrives } from "../../_hooks/useUpcomingDrives";
import { Briefcase, CalendarX2, Loader2 } from "lucide-react";
import { DriverUpcomingRides } from "@/types/Ride";
import { PaginatedData } from "@/types/Moderator";

export default function Page() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUpcomingDrives();

  const upcomingDrives =
    (data?.pages as PaginatedData<DriverUpcomingRides>[] | undefined)?.flatMap(
      (page) => page.items ?? [],
    ) ?? [];

  return (
    <section>
      {isLoading ? ( //? Loading State
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <UpcomingCardSkeleton key={`upcoming-drive-skeleton-${index}`} />
          ))}
        </div>
      ) : upcomingDrives.length === 0 ? ( //? Empty State
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-border bg-card/40 px-6 py-12 text-center">
          <div className="relative mb-5 flex size-16 items-center justify-center rounded-full bg-pale-sky/10">
            <Briefcase className="size-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            You have no upcoming trips scheduled
          </h2>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingDrives.map((ride) => (
              <DriverRideCard key={ride.rideId} ride={ride} />
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