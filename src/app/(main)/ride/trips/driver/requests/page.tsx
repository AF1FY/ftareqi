"use client";

import { useState } from "react";
import { Inbox, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RideRequestCard } from "../../_components/ride-request-card";
import { RideRequestCardSkeleton } from "./_components/RideRequestCardSkeleton";
import {
  acceptRideRequestAsync,
  declineRideRequestAsync,
} from "@/lib/actions/Ride.actions";
import {
  FILTER_OPTIONS,
  RequestFilter,
  useDriverRequests,
} from "./_hooks/useDriverRequests";
import { BookingStatus } from "@/types/Ride";
import { toast } from "sonner";

function EmptyRequestsState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
      <Inbox
        className="mb-4 h-14 w-14 text-dodger-blue-dark"
        strokeWidth={1.5}
      />
      <h3 className="text-xl font-semibold text-foreground">
        No requests found
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        There are no passenger requests for the selected filter right now.
      </p>
    </div>
  );
}

export default function Page() {
  const [filter, setFilter] = useState<RequestFilter>(BookingStatus.Pending);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useDriverRequests(filter);

  const requests = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  const handleRefresh = () => {
    void refetch();
  };

  const handleAccept = async (bookingId: number) => {
    setIsAccepting(true);
    const response = await acceptRideRequestAsync(bookingId);

    if (!response.success) {
      toast.error(
        response.message ??
          response.errors?.[0] ??
          "Failed to accept ride request",
        { duration: 4000, position: "top-right" },
      );
      console.error(
        response.message ??
          response.errors?.[0] ??
          "Failed to accept ride request",
      );
      setIsAccepting(false);
      return;
    }
    toast.success(response.message ?? "Ride request accepted", {
      duration: 4000,
      position: "top-right",
    });
    await refetch();
    setIsAccepting(false);
  };

  const handleDecline = async (bookingId: number) => {
    setIsDeclining(true);
    const response = await declineRideRequestAsync(bookingId);

    if (!response.success) {
      toast.error(
        response.message ??
          response.errors?.[0] ??
          "Failed to decline ride request",
        { duration: 4000, position: "top-right" },
      );
      console.error(
        response.message ??
          response.errors?.[0] ??
          "Failed to decline ride request",
      );
      setIsDeclining(false);
      return;
    }
    toast.success(response.message ?? "Ride request declined", {
      duration: 4000,
      position: "top-right",
    });
    await refetch();
    setIsDeclining(false);
  };

  return (
    <div className="min-h-screen">
      <div className="flex w-full flex-col gap-6">
        <header className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={handleRefresh}
            aria-label="Refresh requests"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading || isRefetching ? "animate-spin" : ""}`}
            />
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as RequestFilter)}
            >
              <SelectTrigger className="h-10 w-full sm:w-56">
                <SelectValue placeholder="Filter requests" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <RideRequestCardSkeleton key={`request-skeleton-${index}`} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyRequestsState />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {requests.map((request) => (
                <RideRequestCard
                  key={request.bookingId}
                  request={request}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  isAccepting={isAccepting}
                  isDeclining={isDeclining}
                />
              ))}
            </div>

            {hasNextPage ? (
              <div className="flex justify-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="min-w-36"
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
      </div>
    </div>
  );
}
