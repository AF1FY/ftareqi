"use client";
import { useReports } from "./_hooks/useReports";
import { SummaryCards } from "./_components/SummaryCards";
import { ReportsTable } from "./_components/ReportsTable";
import { LoadingDashboard } from "./_components/LoadingDashboard";
import { EmptyState } from "./_components/EmptyState";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReportStatus } from "@/types/Report";
import { Filter } from "lucide-react";

export default function ReportsPage() {
    const {
        page,
        setPage,
        statusFilter,
        setStatusFilter,
        reasonFilter,
        setReasonFilter,
        summaryQuery,
        reportsQuery,
    } = useReports();
    const isGlobalLoading = summaryQuery.isLoading || reportsQuery.isLoading;
    if (isGlobalLoading) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Reports Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and review user reports
                    </p>
                </div>
                <LoadingDashboard />
            </div>
        );
    }
    const hasReports =
        reportsQuery.data?.data?.items &&
        reportsQuery.data.data.items.length > 0;
    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Reports Management
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage and review user reports
                </p>
            </div>
            {summaryQuery.data?.data && (
                <SummaryCards summary={summaryQuery.data.data} />
            )}
            <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-0 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h2 className="text-xl font-semibold">Reports List</h2>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-4 sm:w-auto">
                    <div className="w-full">
                        <Select
                            value={statusFilter}
                            onValueChange={(val: any) => {
                                setStatusFilter(val);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value={ReportStatus.Pending}>
                                    Pending
                                </SelectItem>
                                <SelectItem value={ReportStatus.Resolved}>
                                    Resolved
                                </SelectItem>
                                <SelectItem value={ReportStatus.Rejected}>
                                    Rejected
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full">
                        <Select
                            value={reasonFilter}
                            onValueChange={(val: any) => {
                                setReasonFilter(val);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="Spam">Spam</SelectItem>
                                <SelectItem value="Harassment">
                                    Harassment
                                </SelectItem>
                                <SelectItem value="Fraud">Fraud</SelectItem>
                                <SelectItem value="etc">Etc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            {hasReports && reportsQuery.data?.data ? (
                <ReportsTable
                    data={reportsQuery.data.data}
                    page={page}
                    setPage={setPage}
                />
            ) : (
                <EmptyState />
            )}
        </div>
    );
}
