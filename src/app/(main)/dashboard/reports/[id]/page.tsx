"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDriverReportsHistory } from "../_hooks/useDriverReports";

import {
    ChevronLeft,
    Star,
    Car,
    User,
    Calendar,
    MoreHorizontal,
    Check,
    Ban,
    Loader2,
    AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useDriverProfile } from "@/app/(main)/profile/_components/DriverProfileModal";
import { ReportItem, ReportStatus } from "@/types/Report";
import { ReportReason } from "@/lib/validators/report.schema";
import { getReasonColor, getStatusColor } from "@/lib/services/reportService";
import { getDateFormatted } from "@/lib/services/walletService";
import { BanUserModal } from "../../ban/_components/BanUserModal";

export default function DriverReportsHistoryPage() {
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const params = useParams();
    const router = useRouter();
    const reportedUserId = params.id as string;

    const { data: driverResponse, isLoading: isDriverLoading } =
        useDriverProfile(reportedUserId, true);
    const driverData = driverResponse?.data;

    const {
        reportsPages,
        isLoading: isReportsLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        filters,
        setStatusFilter,
      setReasonFilter,
      updateStatus,
        isUpdating
    } = useDriverReportsHistory(reportedUserId);

    const allReports = useMemo(() => {
        return reportsPages.flatMap((page) => page?.reports?.items ?? []);
    }, [reportsPages]);

    //? Skeleton for the loading state
    if (isDriverLoading || (isReportsLoading && allReports.length === 0)) {
        return (
            <div className="min-h-screen bg-background p-6 md:p-8 max-w-[1000px] mx-auto w-full space-y-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-[150px] rounded-md" />
                    <Skeleton className="h-10 w-[150px] rounded-md" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="full-scn p-6 md:px-8 md:py-0 md:pt-4 max-w-4xl mx-auto w-full space-y-4 animate-in fade-in duration-500">
            {/* 1. Page Header & Navigation */}
            <div className="space-y-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground -ml-3"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Reports
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    Driver Reports History
                </h1>
            </div>

            {/* 2. Top Section: Driver Profile Summary */}
            {driverData && (
                <Card className="border-border shadow-sm p-6 bg-card mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                            <AvatarImage
                                src={driverData.driverImg}
                                alt={driverData.name}
                            />
                            <AvatarFallback className="text-xl">
                                {driverData.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-3 flex-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    {driverData.name}
                                </h2>
                                <div className="shrink-0 mt-4 md:mt-0">
                                    <Button
                                        variant="destructive"
                                        onClick={() => setIsBanModalOpen(true)}
                                    >
                                        <Ban className="w-4 h-4" />
                                        Ban Driver
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                {/*//? Rating */}
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                            Rating
                                        </span>
                                        <span className="text-sm font-medium">
                                            {driverData.rating !== null
                                                ? driverData.rating.toFixed(1)
                                                : "New"}
                                        </span>
                                    </div>
                                </div>
                                {/*//? Trips taken  */}
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Car className="h-4 w-4 text-dodger-blue" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                            Trips Taken
                                        </span>
                                        <span className="text-sm font-medium">
                                            {driverData.tripsTaken}
                                        </span>
                                    </div>
                                </div>
                                {/*//? Gender  */}
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                            Gender
                                        </span>
                                        <span className="text-sm font-medium">
                                            {driverData.gender}
                                        </span>
                                    </div>
                                </div>
                                {/*//? Joined at  */}
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                            Joined
                                        </span>
                                        <span className="text-sm font-medium">
                                            {getDateFormatted(
                                                driverData.joinedAt,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* 3. Filters Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Select
                        value={filters.statusFilter}
                        onValueChange={(val) =>
                            setStatusFilter(val as ReportStatus)
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[150px] bg-background">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.reasonFilter}
                        onValueChange={(val) =>
                            setReasonFilter(val as ReportReason)
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[150px] bg-background">
                            <SelectValue placeholder="Reason" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Reasons</SelectItem>
                            <SelectItem value="Spam">Spam</SelectItem>
                            <SelectItem value="Harassment">
                                Harassment
                            </SelectItem>
                            <SelectItem value="Fraud">Fraud</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 4. Reports Feed */}
            <div className="space-y-4">
                {allReports.length > 0 ? (
                    allReports.map((report: ReportItem, i) => (
                        <Card
                            key={i}
                            className="overflow-hidden border-border shadow-sm"
                        >
                            <div className="p-5 space-y-4">
                                {/* Header of the Card */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                                {report.reporterName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                reported on{" "}
                                                {new Date(
                                                    report.createdAt,
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="-mt-2 -mr-2 h-8 w-8"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                disabled={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    updateStatus({
                                                        reportId: report.id,
                                                        status: ReportStatus.Resolved,
                                                    })
                                                }
                                            >
                                                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                                                <span>Resolve Report</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                disabled={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    updateStatus({
                                                        reportId: report.id,
                                                        status: ReportStatus.Rejected,
                                                    })
                                                }
                                            >
                                                <Ban className="mr-2 h-4 w-4" />
                                                <span>Reject Report</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Badges */}
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`border ${getReasonColor(report.type)}`}
                                    >
                                        {report.type}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={`border ${getStatusColor(report.status)}`}
                                    >
                                        {report.status}
                                    </Badge>
                                </div>

                                {/* Body of the Card */}
                                <div className="bg-muted/30 dark:bg-slate-900/50 p-4 rounded-md border border-border/50">
                                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word">
                                        {report.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    /* Empty State UI */
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card border border-dashed border-border rounded-lg shadow-sm">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-1">
                            No reports found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            There are no reports matching your current filters.
                        </p>
                    </div>
                )}
            </div>

            {/* 5. Bottom Section: Pagination (Load More) */}
            {allReports.length > 0 && (
                <div className="flex flex-col items-center justify-center pt-4 pb-8 space-y-4">
                    {hasNextPage ? (
                        <Button
                            variant="outline"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="w-full sm:w-auto min-w-[140px]"
                        >
                            {isFetchingNextPage && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Load More
                        </Button>
                    ) : (
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            You have reached the end of the list.
                        </span>
                    )}
                </div>
            )}
            <BanUserModal
                driverId={reportedUserId}
                isOpen={isBanModalOpen}
                onOpenChange={setIsBanModalOpen}
                userName={driverData?.name}
            />
        </div>
    );
}
