import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getAllReportsAsync, getReportsSummaryAsync } from '@/lib/actions/Report.actions';
import { ReportStatus, ReportsRequestDTO } from '@/types/Report';
import { ReportReason } from '@/lib/validators/report.schema';

export const useReports = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'All'>(ReportStatus.Pending);
  const [reasonFilter, setReasonFilter] = useState<ReportReason | 'All'>('All');

  const summaryQuery = useQuery({
    queryKey: ['reports-summary'],
    queryFn: () => getReportsSummaryAsync(),
  });

  const payload: any = {
    Page: page,
    PageSize: pageSize,
  };

  if (statusFilter !== 'All') {
    payload.Status = statusFilter;
  }
  
  if (reasonFilter !== 'All') {
    payload.Reason = reasonFilter;
  }

  const reportsQuery = useQuery({
    queryKey: ['reports', page, pageSize, statusFilter, reasonFilter],
    queryFn: () => getAllReportsAsync(payload as ReportsRequestDTO),
    keepPreviousData: true,
  });

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    reasonFilter,
    setReasonFilter,
    summaryQuery,
    reportsQuery
  };
};
