import { DriverReportData, DriverReportsRequestDto, ReportsRequestDTO, ReportsSummary, ReportStatus, UserReport } from "@/types/Report";
import { ReportRequestDTO } from "../validators/report.schema";
import { getDataAsync, getPaginatedDataAsync, postDataAsync, updateDataAsync } from "./Base.actions";

const BASE_API = 'api/reports';
//* Create Report
export const addReportAsync = async (report: ReportRequestDTO) =>
  postDataAsync<undefined, ReportRequestDTO>(BASE_API, report, 'Failed to report driver.');

//? Get all reports
export const getAllReportsAsync = async (params: ReportsRequestDTO) =>
  getPaginatedDataAsync<UserReport, ReportsRequestDTO>(`${BASE_API}/moderation/reports`, undefined, 'Failed to fetch all reports.', [], params);

//? Get reports summary
export const getReportsSummaryAsync = async () =>
  getDataAsync<ReportsSummary, undefined>(`${BASE_API}/moderation/reports/summary`);

//? Get report by ID
export const getReportByIdAsync = async (reportId: number) =>
  getDataAsync<UserReport, undefined>(`${BASE_API}/${reportId}`, undefined, 'Failed to get report in details.');

//? Get reports for one driver
export const getDriverReportAsync = async (params: DriverReportsRequestDto) => 
  getPaginatedDataAsync<DriverReportData, DriverReportsRequestDto>(`${BASE_API}/moderation/reported-user/${params.reportedUserId}`,'' , '', [], params)

//^ Update report status
export const UpdateReportStatusAsync = async (reportId: number, reportStatus: ReportStatus) => 
  updateDataAsync<undefined, { status: string }>(`${BASE_API}/${reportId}/status`, { status: reportStatus })