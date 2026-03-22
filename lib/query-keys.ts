import { DashboardFilters } from "@/lib/types";

export const dashboardKeys = {
  overview: (filters: DashboardFilters) => ["dashboard-overview", filters] as const,
};
