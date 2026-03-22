import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { parseDashboardFilters } from "@/lib/dashboard-filters";
import { fetchDashboardOverview } from "@/lib/mock-dashboard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseDashboardFilters(resolvedSearchParams);
  const overview = await fetchDashboardOverview(filters);

  return (
    <DashboardShell
      header={<OverviewHeader headline={overview.headline} subheadline={overview.subheadline} filters={filters} />}
      filters={<FilterBar />}
    >
      <OverviewDashboard filters={filters} initialData={overview} />
    </DashboardShell>
  );
}
