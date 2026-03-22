export type DashboardScope = "7d" | "30d" | "90d";
export type DashboardRegion = "all" | "na" | "emea" | "apac";
export type DashboardChannel = "all" | "paid" | "organic" | "partner";

export type DashboardFilters = {
  scope: DashboardScope;
  region: DashboardRegion;
  channel: DashboardChannel;
};

export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaTone: "up" | "down" | "neutral";
  note: string;
};

export type TrendPoint = {
  label: string;
  revenue: number;
  conversionRate: number;
  qualityScore: number;
};

export type AlertItem = {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  detail: string;
};

export type BreakdownItem = {
  segment: string;
  value: number;
  change: number;
  tone: "accent" | "success" | "warning";
};

export type PerformanceRow = {
  id: string;
  campaign: string;
  owner: string;
  spend: number;
  roas: number;
  conversions: number;
  velocity: "stable" | "surging" | "cooling";
};

export type DashboardOverview = {
  headline: string;
  subheadline: string;
  kpis: KpiMetric[];
  trend: TrendPoint[];
  alerts: AlertItem[];
  breakdown: BreakdownItem[];
  performance: PerformanceRow[];
};
