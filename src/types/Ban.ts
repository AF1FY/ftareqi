import { ReportReason } from "@/lib/validators/report.schema";

export interface BanStatistic {
    type: ReportReason;
    count: number;
    percentage: number;
}

export interface BansSummary {
    totalBannedUsersCount: number;
    statistics: BanStatistic[];
}

export interface BannedUserItem {
    banId: number;
    driverProfileId: number;
    name: string;
    type: ReportReason;
    expirationDate: string;
    moderatorName: string;
}