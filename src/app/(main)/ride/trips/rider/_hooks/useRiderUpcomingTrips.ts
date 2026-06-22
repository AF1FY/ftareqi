"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getRiderUpcomingTripsAsync } from "@/lib/actions/Ride.actions";
import { PaginatedData } from "@/types/Moderator";
import { RiderTrip, RiderUpcomingTripRequestDTO } from "@/types/Ride";

export type RiderUpcomingFilter =
  | "All"
  | NonNullable<RiderUpcomingTripRequestDTO["FilterBy"]>;

export const FILTER_OPTIONS: { value: RiderUpcomingFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Accepted", label: "Accepted" },
];

const PAGE_SIZE = 10;

export function useRiderUpcomingTrips(filter: RiderUpcomingFilter) {
  return useInfiniteQuery({
    queryKey: ["riderUpcomingTrips", filter],
    queryFn: async ({ pageParam = 1 }) => {
      const params: RiderUpcomingTripRequestDTO = {
        Page: pageParam,
        PageSize: PAGE_SIZE,
        ...(filter === "All" ? {} : { FilterBy: filter }),
      };

      const response = await getRiderUpcomingTripsAsync(params);

      if (!response.success) {
        console.error(
          response.message ??
            response.errors?.[0] ??
            "Failed to fetch rider upcoming trips",
        );
      }

      return (
        response.data ?? {
          items: [],
          page: pageParam,
          pageSize: PAGE_SIZE,
          totalCount: 0,
          totalPages: 0,
        }
      );
    },
    getNextPageParam: (lastPage: PaginatedData<RiderTrip>) => {
      if (!lastPage) {
        return undefined;
      }

      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
  });
}
