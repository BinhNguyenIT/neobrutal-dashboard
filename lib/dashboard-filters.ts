import {
  DashboardChannel,
  DashboardFilters,
  DashboardRegion,
  DashboardScope,
} from "@/lib/types";

const scopes = new Set<DashboardScope>(["7d", "30d", "90d"]);
const regions = new Set<DashboardRegion>(["all", "na", "emea", "apac"]);
const channels = new Set<DashboardChannel>(["all", "paid", "organic", "partner"]);

export const defaultFilters: DashboardFilters = {
  scope: "30d",
  region: "all",
  channel: "all",
};

export function parseDashboardFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): DashboardFilters {
  const scope = readValue(params, "scope");
  const region = readValue(params, "region");
  const channel = readValue(params, "channel");

  return {
    scope: scopes.has(scope as DashboardScope) ? (scope as DashboardScope) : defaultFilters.scope,
    region: regions.has(region as DashboardRegion)
      ? (region as DashboardRegion)
      : defaultFilters.region,
    channel: channels.has(channel as DashboardChannel)
      ? (channel as DashboardChannel)
      : defaultFilters.channel,
  };
}

export function toDashboardSearchParams(filters: DashboardFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.scope !== defaultFilters.scope) {
    params.set("scope", filters.scope);
  }

  if (filters.region !== defaultFilters.region) {
    params.set("region", filters.region);
  }

  if (filters.channel !== defaultFilters.channel) {
    params.set("channel", filters.channel);
  }

  return params;
}

function readValue(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  if (params instanceof URLSearchParams) {
    return params.get(key) ?? undefined;
  }

  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}
