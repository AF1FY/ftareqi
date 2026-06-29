import { ReportReason } from "@/lib/validators/report.schema";
import { PaginatedReq } from "./Auth";
import { PaginatedData } from "./Moderator";

export enum ReportStatus {
    Pending = "Pending",
    Resolved = "Resolved",
    Rejected = "Rejected",
}

export interface ReportsRequestDTO extends PaginatedReq {
    Status?: ReportStatus;
    Reason?: ReportReason;
}

export interface UserReport {
    id: number;
    reporterUserId: string;
    reporterName: string;
    reportedUserId: string;
    reportedUserName: string;
    type: ReportReason;
    status: ReportStatus;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReportsSummary {
    pendingReportsCount: number;
    reportsTodayCount: number;
    reportedUsersCount: number;
}

export interface DriverReportsRequestDto extends ReportsRequestDTO {
    reportedUserId: string;
}

export interface ReportItem extends Omit<
    UserReport,
    "reporterUserId" | "reportedUserName" | "reportedUserId"
> {}

export interface DriverReportData {
    reportedUserId: string;
    reportedUserName: string;
    reports: PaginatedData<ReportItem>;
}
