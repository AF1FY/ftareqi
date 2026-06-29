import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    Check,
    Ban,
    ExternalLink,
    Star,
    Eye,
    MoreHorizontal,
    Car,
    User,
    Calendar,
} from "lucide-react";
import Link from "next/link";
import { useReportDetails } from "../_hooks/useReportDetails";
import { useDriverProfile } from "@/app/(main)/profile/_components/DriverProfileModal";
import { getFullNameLatters } from "@/lib/services/userProfileService";
import {
    getDateFormatted,
    getFullDateFormatted,
} from "@/lib/services/walletService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getReasonColor, getStatusColor } from "@/lib/services/reportService";

interface ReportDetailsModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    reportId: number;
    reportedUserId: string | null;
}

export const ReportDetailsModal = ({
    isOpen,
    onOpenChange,
    reportId,
    reportedUserId,
}: ReportDetailsModalProps) => {
    const {
        data: report,
        isLoading: isReportLoading,
        resolveReport,
        rejectReport,
        isUpdating,
    } = useReportDetails(reportId, isOpen);

    const { data: driverResponse, isLoading: isDriverLoading } =
        useDriverProfile(reportedUserId || "", isOpen && !!reportedUserId);

    const driver = driverResponse?.data;
    const isLoading = isReportLoading || isDriverLoading;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>Report Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-6 py-4">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 py-2">
                        {/* Section A: Driver Information */}
                        {driver && (
                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-muted/30 p-5 rounded-lg border border-border/50">
                                <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                                    <AvatarImage
                                        src={driver.driverImg}
                                        alt={driver.name}
                                    />
                                    <AvatarFallback>
                                        {getFullNameLatters(driver.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-xl leading-none text-center sm:text-left">
                                            {driver.name}
                                        </h3>
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={resolveReport}
                                                    disabled={isUpdating}
                                                >
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Resolve Report
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={rejectReport}
                                                    disabled={isUpdating}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    Reject Report
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`reports/${reportedUserId}`}
                                                    >
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        View all driver's
                                                        reports
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
                                                    {driver.rating !== null
                                                        ? driver.rating.toFixed(
                                                              1,
                                                          )
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
                                                    {driver.tripsTaken}
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
                                                    {driver.gender}
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
                                                        driver.joinedAt,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section B: Report Information */}
                        {report && (
                            <div className="space-y-5 bg-muted/10 py-3 px-5 rounded-lg border border-border/50">
                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-x-8 gap-y-4 text-sm">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                                            Reporter
                                        </span>
                                        <span className="font-medium flex items-center gap-2">
                                            <span className="flex items-center justify-center p-2 bg-primary/10 text-primary rounded-full text-xs">
                                                {getFullNameLatters(
                                                    report.reporterName,
                                                )}
                                            </span>
                                            {report.reporterName}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                                            Date Created
                                        </span>
                                        <span className="font-medium h-6 flex items-center">
                                            {getFullDateFormatted(
                                                report.createdAt,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                                            Type
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className={`w-fit ${getReasonColor(report.type)}`}
                                        >
                                            {report.type}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                                            Status
                                        </span>
                                        <Badge
                                            className={`w-fit ${getStatusColor(report.status)}`}
                                        >
                                            {report.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block">
                                        Description
                                    </span>
                                    <ScrollArea className="h-[100px] w-full rounded-md bg-background p-3.5 border text-sm leading-relaxed shadow-inner">
                                        {report.description}
                                    </ScrollArea>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
