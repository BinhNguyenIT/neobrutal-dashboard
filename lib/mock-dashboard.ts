import { DashboardFilters, DashboardOverview } from "@/lib/types";

const scopedRevenue = {
  "7d": [190, 220, 210, 245, 260, 252, 280],
  "30d": [180, 194, 202, 210, 218, 224, 235, 247, 255, 264, 276, 282],
  "90d": [140, 148, 154, 162, 170, 176, 189, 198, 204, 212, 224, 237],
} as const;

export async function fetchDashboardOverview(filters: DashboardFilters): Promise<DashboardOverview> {
  const revenueSeries = scopedRevenue[filters.scope];
  const regionLabel = labelForRegion(filters.region);
  const channelLabel = labelForChannel(filters.channel);

  return Promise.resolve({
    headline: "Revenue command center",
    subheadline: `Monitoring ${channelLabel} motion across ${regionLabel} for the last ${filters.scope}.`,
    kpis: [
      {
        id: "pipeline",
        label: "Pipeline Value",
        value: filters.scope === "90d" ? "$4.8M" : "$1.9M",
        delta: "+8.4%",
        deltaTone: "up",
        note: "Momentum above target"
      },
      {
        id: "roas",
        label: "Blended ROAS",
        value: filters.channel === "paid" ? "4.2x" : "5.1x",
        delta: filters.channel === "paid" ? "-0.3x" : "+0.6x",
        deltaTone: filters.channel === "paid" ? "down" : "up",
        note: "Week-over-week efficiency"
      },
      {
        id: "conv",
        label: "Conversion Rate",
        value: filters.region === "emea" ? "3.8%" : "4.4%",
        delta: "+0.5 pts",
        deltaTone: "up",
        note: "Qualified sessions only"
      },
      {
        id: "latency",
        label: "Alert Response",
        value: "11 min",
        delta: "-2 min",
        deltaTone: "up",
        note: "Ops triage turnaround"
      },
    ],
    trend: revenueSeries.map((value, index) => ({
      label: `${index + 1}`,
      revenue: value * 1000,
      conversionRate: Number((3.1 + index * 0.09).toFixed(2)),
      qualityScore: 68 + (index % 5) * 4,
    })),
    alerts: [
      {
        id: "a1",
        title: "Budget pacing slip",
        severity: "critical",
        detail: `${channelLabel} spend in ${regionLabel} is trailing plan by 9%.`,
      },
      {
        id: "a2",
        title: "Creative refresh win",
        severity: "info",
        detail: "Fresh landing page variants are lifting CTR by 14%.",
      },
      {
        id: "a3",
        title: "Attribution lag",
        severity: "warning",
        detail: "Two partner feeds are reporting conversions 3 hours late.",
      },
    ],
    breakdown: [
      { segment: "Enterprise", value: 44, change: 6, tone: "accent" },
      { segment: "Mid-market", value: 31, change: 2, tone: "success" },
      { segment: "SMB", value: 17, change: -3, tone: "warning" },
      { segment: "Expansion", value: 8, change: 1, tone: "accent" },
    ],
    performance: [
      {
        id: "p1",
        campaign: "Northstar Search",
        owner: "A. Moss",
        spend: 42000,
        roas: 5.8,
        conversions: 184,
        velocity: "surging",
      },
      {
        id: "p2",
        campaign: "Pipeline Retargeting",
        owner: "D. Ortiz",
        spend: 28000,
        roas: 4.3,
        conversions: 132,
        velocity: "stable",
      },
      {
        id: "p3",
        campaign: "Partner Co-Sell",
        owner: "M. Chen",
        spend: 16000,
        roas: 3.4,
        conversions: 71,
        velocity: "cooling",
      },
      {
        id: "p4",
        campaign: "Lifecycle Upsell",
        owner: "R. Patel",
        spend: 12000,
        roas: 6.1,
        conversions: 88,
        velocity: "surging",
      },
    ],
  });
}

function labelForRegion(region: DashboardFilters["region"]): string {
  if (region === "all") return "all regions";
  if (region === "na") return "North America";
  if (region === "emea") return "EMEA";
  return "APAC";
}

function labelForChannel(channel: DashboardFilters["channel"]): string {
  if (channel === "all") return "all channels";
  if (channel === "paid") return "paid";
  if (channel === "organic") return "organic";
  return "partner";
}
