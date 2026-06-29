"use client";

import React from "react";
import {
    Lock,
    Search,
    Calendar,
    MoreHorizontal,
    Eye,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/Pagination";
import { useBansDashboard } from "./_hooks/useBansHook";
import { BannedUserItem } from "@/types/Ban";

// --- Helper function to color badges based on reason ---
const getColorForType = (type: string) => {
    switch (type) {
        case "Spam":
            return {
                badge: "bg-slate-100 border-slate-200",
                text: "text-slate-700",
            };
        case "Harassment":
            return { badge: "bg-red-100 border-red-200", text: "text-red-700" };
        case "Fraud":
            return {
                badge: "bg-orange-100 border-orange-200",
                text: "text-orange-700",
            };
        default:
            return {
                badge: "bg-gray-100 border-gray-200",
                text: "text-gray-700",
            };
    }
};

export default function BansDashboardPage() {
    const {
        summaryData,
        paginatedData,
        isSummaryLoading,
        isListLoading,
        currentPage,
        sortDescending,
        setCurrentPage,
        unbanUser,
        isUnbanning,
    } = useBansDashboard();

    const totalPages = paginatedData?.totalPages || 1;
    const paginatedUsers = paginatedData?.items || [];

    const getReasonBadge = (reason: string) => {
        const colors = getColorForType(reason);
        return (
            <Badge
                className={`${colors.badge} ${colors.text} shadow-none border`}
            >
                {reason}
            </Badge>
        );
    };

    const getExpirationDisplay = (expirationDate: string | null) => {
        if (!expirationDate) {
            return (
                <Badge
                    variant="destructive"
                    className="flex items-center w-fit py-1"
                >
                    <Lock className="w-3 h-3 mr-1" /> Permanent
                </Badge>
            );
        }

        const date = new Date(expirationDate);
        const isPermanent = date.getFullYear() > 2099;

        if (isPermanent) {
            return (
                <Badge
                    variant="destructive"
                    className="flex items-center w-fit py-1"
                >
                    <Lock className="w-3 h-3 mr-1" /> Permanent
                </Badge>
            );
        }

        return (
            <span className="flex items-center font-medium text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1.5" />
                {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </span>
        );
    };

    return (
        <div className="full-scn flex flex-col p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">
            {/* 1. Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Suspended Users
                </h1>
                <p className="text-muted-foreground mt-1">
                    Monitor and manage suspended and banned accounts on the
                    platform.
                </p>
            </div>

            {/* 2. Analytics / Summary Section */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Total Suspended Accounts */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Suspended Accounts
                        </CardTitle>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isSummaryLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-3xl font-bold">
                                {summaryData?.totalBannedUsersCount || 0}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Violation Ratios */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Violation Ratios
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isSummaryLoading ? (
                            <Skeleton className="h-12 w-full mt-2" />
                        ) : (
                            <div className="space-y-3 mt-2">
                                <div className="flex w-full h-3 rounded-full overflow-hidden">
                                    {summaryData?.statistics.map(
                                        (stat, idx) => {
                                            const colors = [
                                                "bg-slate-500",
                                                "bg-red-500",
                                                "bg-orange-500",
                                                "bg-blue-500",
                                            ];
                                            return (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        width: `${stat.percentage}%`,
                                                    }}
                                                    className={`${colors[idx % colors.length]}`}
                                                    title={`${stat.type}: ${stat.percentage}%`}
                                                />
                                            );
                                        },
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    {summaryData?.statistics.map(
                                        (stat, idx) => (
                                            <span
                                                key={idx}
                                                className="flex items-center gap-1.5"
                                            >
                                                <div
                                                    className={`w-2.5 h-2.5 rounded-full ${["bg-slate-500", "bg-red-500", "bg-orange-500", "bg-blue-500"][idx % 4]}`}
                                                />
                                                {stat.type} ({stat.count})
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 4. Main Content (Bans Data Table) */}
            <div className="rounded-md border bg-background shadow-sm">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Expires On</TableHead>
                            <TableHead>Moderator</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isListLoading ? (
                            // Loading State (Skeletons)
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="size-8 rounded-full" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : paginatedUsers.length > 0 ? (
                            // Display real data
                            paginatedUsers.map((user: BannedUserItem, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="flex gap-2 items-center">
                                            <span className="flex items-center justify-center size-8 bg-muted rounded-full text-sm font-medium">
                                                {(user.name || "U")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getReasonBadge(user.type)}
                                    </TableCell>
                                    <TableCell>
                                        {getExpirationDisplay(user.expirationDate)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {user.moderatorName}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-40"
                                            >
                                                <DropdownMenuLabel className="text-xs">
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        unbanUser(user.banId)
                                                    }
                                                    disabled={isUnbanning}
                                                    className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50"
                                                >
                                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                                    Revoke Ban
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            // Empty State
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-64 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <AlertCircle className="h-10 w-10 mb-4 opacity-20" />
                                        <p className="text-base font-medium text-foreground">
                                            No suspended users found
                                        </p>
                                        <p className="text-sm mt-1">
                                            The platform is currently clear of
                                            any suspended accounts.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 5. Pagination (Positioned at the end of the outer div thanks to flex-col) */}
            {!isListLoading && totalPages > 1 && (
                <Pagination className="mt-auto pt-4 pb-2">
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                            >
                                Previous
                            </Button>
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={currentPage === i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className="cursor-pointer w-8 h-8"
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1),
                                    )
                                }
                            >
                                Next
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
