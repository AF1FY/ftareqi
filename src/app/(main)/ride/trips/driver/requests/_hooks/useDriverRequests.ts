"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getDriverRideRequestsAsync } from "@/lib/actions/Ride.actions";
import { BookingStatus, DriverRequests, RideBookingRequestDto } from "@/types/Ride";
import { PaginatedData } from "@/types/Moderator";

export type RequestFilter = 'All' | BookingStatus;

export const FILTER_OPTIONS: { value: RequestFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: BookingStatus.Pending, label: "Pending" },
  { value: BookingStatus.Accepted, label: "Accepted" },
  { value: BookingStatus.CancelledByDriver, label: "Cancelled by driver" },
  { value: BookingStatus.CancelledByRider, label: "Cancelled by rider" },
  { value: BookingStatus.Expired, label: "Expired" },
];

const PAGE_SIZE = 10;

export function useDriverRequests(filter: RequestFilter) {
  return useInfiniteQuery({
    queryKey: ["driverRequests", filter],
    queryFn: async ({ pageParam = 1 }) => {
      const params: RideBookingRequestDto = {
        Page: pageParam,
        PageSize: PAGE_SIZE,
      };

      if (filter !== "All") {
        params.FilterBy = filter as RideBookingRequestDto["FilterBy"];
      }

      const response = await getDriverRideRequestsAsync(params);

      if (!response.success) {
        console.error(
          response.message ??
            response.errors?.[0] ??
            "Failed to get ride requests for driver",
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
    getNextPageParam: (lastPage: PaginatedData<DriverRequests>) => {
      if (!lastPage) {
        return undefined;
      }

      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
  });
}
