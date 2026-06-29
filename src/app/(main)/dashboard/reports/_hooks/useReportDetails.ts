import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReportByIdAsync, UpdateReportStatusAsync } from "@/lib/actions/Report.actions";
import { ReportStatus } from "@/types/Report";
import { toast } from "sonner";

export const useReportDetails = (reportId: number, enableQuery: boolean) => {
    const queryClient = useQueryClient();

    const reportQuery = useQuery({
        queryKey: ["report-details", reportId],
        queryFn: () => getReportByIdAsync(reportId),
        enabled: enableQuery,
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: ReportStatus) =>
            UpdateReportStatusAsync(reportId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["report-details", reportId] });
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            queryClient.invalidateQueries({ queryKey: ['reports-summary'] });
            toast.success("Report status updated successfully", {position: 'top-right', duration: 3000});
        },
        onError: () => {
            toast.error("Failed to update report status", {position: 'top-right', duration: 3000});
        }
    });

    const resolveReport = () => updateStatusMutation.mutate(ReportStatus.Resolved);
    const rejectReport = () => updateStatusMutation.mutate(ReportStatus.Rejected);

    return {
        data: reportQuery.data?.data,
        isLoading: reportQuery.isLoading,
        isError: reportQuery.isError,
        resolveReport,
        rejectReport,
        isUpdating: updateStatusMutation.isPending,
    };
};