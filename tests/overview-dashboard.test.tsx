import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import CampaignDetail from "@/app/campaigns/[campaignId]/page";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";
import { defaultFilters } from "@/lib/dashboard-filters";
import { fetchDashboardOverview } from "@/lib/mock-dashboard";

vi.mock("recharts", () => {
  const MockResponsiveContainer = ({ children }: { children: React.ReactNode }) => <div data-testid="mock-responsive-container">{children}</div>;
  const MockChart = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

  return {
    ResponsiveContainer: MockResponsiveContainer,
    LineChart: MockChart,
    CartesianGrid: () => null,
    Line: () => null,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: () => null,
  };
});

describe("overview dashboard", () => {
  it("renders primary widgets from mocked data", async () => {
    const data = await fetchDashboardOverview(defaultFilters);
    const client = new QueryClient();

    render(
      <QueryClientProvider client={client}>
        <OverviewDashboard filters={defaultFilters} initialData={data} />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Trend View")).toBeInTheDocument();
    expect(screen.getByText("Segment share")).toBeInTheDocument();
    expect(screen.getByText("Campaign list")).toBeInTheDocument();
  });

  it("preserves active filters in drill-down and back navigation links", async () => {
    const filters = {
      scope: "90d",
      region: "apac",
      channel: "partner",
    } as const;

    const { container } = render(
      <OverviewHeader headline="Pipeline pressure" subheadline="Current performance snapshot" filters={filters} />,
    );

    const drillDownLink = container.querySelector('a[href="/campaigns/northstar-search?scope=90d&region=apac&channel=partner"]');
    expect(drillDownLink).toBeTruthy();

    const detailPage = await CampaignDetail({
      params: Promise.resolve({ campaignId: "northstar-search" }),
      searchParams: Promise.resolve({ scope: "90d", region: "apac", channel: "partner" }),
    });

    render(detailPage);

    expect(screen.getByRole("link", { name: "Back to overview" })).toHaveAttribute(
      "href",
      "/?scope=90d&region=apac&channel=partner",
    );
  });
});
