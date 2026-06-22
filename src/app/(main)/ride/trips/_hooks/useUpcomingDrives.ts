"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getDriverUpcomingRidesAsync } from "@/lib/actions/Ride.actions";

const UPCOMING_DRIVES_PAGE_SIZE = 10;

export function useUpcomingDrives() {
    return useInfiniteQuery(
        ["driver-upcoming-drives"],
        async ({ pageParam = 1 }) => {
            const response = await getDriverUpcomingRidesAsync({
                Page: pageParam,
                PageSize: UPCOMING_DRIVES_PAGE_SIZE,
            });

            if (!response.success || !response.data) {
                throw new Error(response.message);
            }

            return response.data;
        },
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.page < lastPage.totalPages) {
                    return lastPage.page + 1;
                }

                return undefined;
            },
        }
    );
}