"use client";

import { useQuery } from "@tanstack/react-query";

import { AlertsStrip } from "@/components/dashboard/alerts-strip";
import { BreakdownWidget } from "@/components/dashboard/breakdown-widget";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { PerformanceTable } from "@/components/dashboard/performance-table";
import { TrendWidget } from "@/components/dashboard/trend-widget";
import { fetchDashboardOverview } from "@/lib/mock-dashboard";
import { dashboardKeys } from "@/lib/query-keys";
import { DashboardFilters, DashboardOverview } from "@/lib/types";

export function OverviewDashboard({
  filters,
  initialData,
}: {
  filters: DashboardFilters;
  initialData: DashboardOverview;
}) {
  const { data = initialData } = useQuery({
    queryKey: dashboardKeys.overview(filters),
    queryFn: () => fetchDashboardOverview(filters),
    initialData,
  });

  return (
    <div className="space-y-6">
      <KpiGrid metrics={data.kpis} />
      <AlertsStrip alerts={data.alerts} />
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <TrendWidget data={data.trend} />
        <BreakdownWidget items={data.breakdown} />
      </div>
      <PerformanceTable data={data.performance} />
    </div>
  );
}
