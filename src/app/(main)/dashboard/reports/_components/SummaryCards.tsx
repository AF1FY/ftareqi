import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportsSummary } from '@/types/Report';
import { AlertCircle, Calendar, Users } from 'lucide-react';
export const SummaryCards = ({ summary }: { summary: ReportsSummary }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.pendingReportsCount}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.reportsTodayCount}</div>
          <p className="text-xs text-muted-foreground">In the last 24 hours</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reported Users</CardTitle>
          <Users className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.reportedUsersCount}</div>
          <p className="text-xs text-muted-foreground">Total unique users reported</p>
        </CardContent>
      </Card>
    </div>
  );
};
