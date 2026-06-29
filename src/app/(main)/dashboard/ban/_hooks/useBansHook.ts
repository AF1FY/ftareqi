import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReportReason } from "@/lib/validators/report.schema";
import {
    getBannedDriversAsync,
    getBanSummaryAsync,
    unBanDriverAsync,
} from "@/lib/actions/Ban.Actions";
import { PaginatedReq } from "@/types/Auth";
import { toast } from "sonner";

export function useBansDashboard() {
    const queryClient = useQueryClient();

    // --- Local State ---
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortDescending, setSortDescending] = useState<boolean>(true);

    // --- Queries ---

    // 1. Fetch ban statistics (Summary)
    const summaryQuery = useQuery({
        queryKey: ["bans-summary"],
        queryFn: getBanSummaryAsync,
    });

    // 2. Fetch banned users list (Paginated List)
    const listQuery = useQuery({
        queryKey: ["bans-list", currentPage, sortDescending],
        queryFn: async () => {
            const payload: PaginatedReq & { Reason?: string } = {
                Page: currentPage,
                PageSize: 10,
                SortDescending: sortDescending,
            };

            return getBannedDriversAsync(payload);
        },
        keepPreviousData: true, // Prevent table from disappearing while switching pages
    });

    const unbanMutation = useMutation({
        mutationFn: (banId: number) => unBanDriverAsync(banId),
      onSuccess: () => {
          toast.success('User unbanned successfuly',{duration: 3000, position: 'top-right'})
            queryClient.invalidateQueries({ queryKey: ["bans-list"] });
            queryClient.invalidateQueries({ queryKey: ["bans-summary"] });
        },
    });

    // --- Handlers ---
    const handleReasonChange = (value: ReportReason) => {
        setCurrentPage(1); // Return to first page on filter change
    };

    const handleSortChange = (value: string) => {
        setSortDescending(value === "Newest");
        setCurrentPage(1);
    };

    return {
        // Data
        summaryData: summaryQuery.data?.data,
        paginatedData: listQuery.data?.data,

        // Loading States
        isSummaryLoading: summaryQuery.isLoading,
        isListLoading: listQuery.isLoading,

        // State Values
        currentPage,
        sortDescending,

        // Setters & Handlers
        setCurrentPage,
        handleReasonChange,
        handleSortChange,

        // Mutations
        unbanUser: unbanMutation.mutate,
        isUnbanning: unbanMutation.isPending,
    };
}
