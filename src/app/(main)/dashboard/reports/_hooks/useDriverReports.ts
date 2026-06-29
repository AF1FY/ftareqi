import { useState } from "react";
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { DriverReportsRequestDto, ReportStatus } from "@/types/Report";
import { ReportReason } from "@/lib/validators/report.schema";
import {
    getDriverReportAsync,
    UpdateReportStatusAsync,
} from "@/lib/actions/Report.actions";

const PAGE_SIZE = 12;

export const useDriverReportsHistory = (reportedUserId: string) => {
    const queryClient = useQueryClient();

    const [statusFilter, setStatusFilter] = useState<ReportStatus | "All">(
        ReportStatus.Pending,
    );
    const [reasonFilter, setReasonFilter] = useState<ReportReason | "All">(
        "All",
    );

    const queryKey = [
        "driver-reports",
        reportedUserId,
        statusFilter,
        reasonFilter,
    ];

    const reportsQuery = useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam = 1 }) => {
            const payload: DriverReportsRequestDto = {
                reportedUserId,
                Page: pageParam,
                PageSize: PAGE_SIZE,
            };

            if (statusFilter !== "All") payload.Status = statusFilter;
            if (reasonFilter !== "All") payload.Reason = reasonFilter;

            const response = await getDriverReportAsync(payload);
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
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });

    const updateStatusMutation = useMutation({
        // mutationFn: UpdateReportStatusAsync,
        mutationFn: async (data: {
            reportId: number;
            status: ReportStatus;
        }) => {
            return UpdateReportStatusAsync(data.reportId, data.status);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["driver-reports", reportedUserId],
            });
            queryClient.invalidateQueries({
                queryKey,
            });
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
        },
    });

    return {
        reportsPages: reportsQuery.data?.pages || [],
        isLoading: reportsQuery.isLoading,
        isFetchingNextPage: reportsQuery.isFetchingNextPage,
        hasNextPage: reportsQuery.hasNextPage,
        fetchNextPage: reportsQuery.fetchNextPage,

        filters: { statusFilter, reasonFilter },
        setStatusFilter,
        setReasonFilter,

        updateStatus: updateStatusMutation.mutate,
        isUpdating: updateStatusMutation.isPending,
    };
};
