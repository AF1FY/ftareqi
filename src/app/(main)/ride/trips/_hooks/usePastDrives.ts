"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getDriverPastRidesAsync } from "@/lib/actions/Ride.actions";

const PAST_DRIVES_PAGE_SIZE = 10;

export function usePastDrives() {
    return useInfiniteQuery(
        ["driver-past-drives"],
        async ({ pageParam = 1 }) => {
            const response = await getDriverPastRidesAsync({
                Page: pageParam,
                PageSize: PAST_DRIVES_PAGE_SIZE,
            });
            
            if (!response.success || !response.data) {
                throw new Error(response.message || "Failed to fetch past drives");
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