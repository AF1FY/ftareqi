"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getRiderPastTripsAsync } from "@/lib/actions/Ride.actions";
import { PaginatedData } from "@/types/Moderator";
import { RiderTrip } from "@/types/Ride";
import { PaginatedReq } from "@/types/Auth";

const PAGE_SIZE = 10;

export function useRiderHistoryTrips() {
  return useInfiniteQuery({
    queryKey: ["riderHistoryTrips"],
    queryFn: async ({ pageParam = 1 }) => {
      const params: PaginatedReq = {
        Page: pageParam,
        PageSize: PAGE_SIZE,
      };

      const response = await getRiderPastTripsAsync(params);

      if (!response.success) {
        console.error(
          response.message ??
            response.errors?.[0] ??
            "Failed to fetch rider history trips",
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
