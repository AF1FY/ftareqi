import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/badge";
import { UserReport } from "@/types/Report";
import { PaginatedData } from "@/types/Moderator";
import { getReasonColor, getStatusColor } from "@/lib/services/reportService";
import { getFullNameLatters } from "@/lib/services/userProfileService";
import { getFullDateFormatted } from "@/lib/services/walletService";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Flag, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ReportDetailsModal } from "./ReportDetailsModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface ReportsTableProps {
    data: PaginatedData<UserReport>;
    page: number;
    setPage: (page: number) => void;
}
export const ReportsTable = ({ data, page, setPage }: ReportsTableProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = data.totalPages || 1;
    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-background shadow-sm">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Reported User</TableHead>
                            <TableHead>Reporter</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Description
                            </TableHead>
                            <TableHead className="text-end">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.items.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <div className="flex gap-2 items-center">
                                        <span className="flex items-center justify-center size-8 bg-pale-sky/20 rounded-full text-sm">
                                            {getFullNameLatters(
                                                report.reportedUserName,
                                            )}
                                        </span>
                                        {report.reportedUserName}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 items-center">
                                        <span className="flex items-center justify-center size-8 bg-pale-sky/20 rounded-full text-sm">
                                            {getFullNameLatters(
                                                report.reporterName,
                                            )}
                                        </span>
                                        {report.reporterName}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={getReasonColor(report.type)}
                                    >
                                        {report.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={getStatusColor(
                                            report.status,
                                        )}
                                    >
                                        {report.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {getFullDateFormatted(report.createdAt)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                                    {report.description}
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
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setIsModalOpen(true)
                                                }
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`reports/${report.reportedUserId}`}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Flag className="h-4 w-4" />
                                                    View All reports
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <ReportDetailsModal
                                    key={report.id}
                                    isOpen={isModalOpen}
                                    onOpenChange={setIsModalOpen}
                                    reportId={report.id}
                                    reportedUserId={report.reportedUserId}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage(Math.max(1, page - 1))}
                                className={
                                    page === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <span className="text-sm font-medium mx-4">
                                Page {page} of {totalPages}
                            </span>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    setPage(Math.min(totalPages, page + 1))
                                }
                                className={
                                    page >= totalPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};
