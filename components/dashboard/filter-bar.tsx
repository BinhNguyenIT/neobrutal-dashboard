"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { parseDashboardFilters, toDashboardSearchParams } from "@/lib/dashboard-filters";
import { DashboardChannel, DashboardRegion, DashboardScope } from "@/lib/types";

const filterOptions = {
  scope: ["7d", "30d", "90d"] as DashboardScope[],
  region: ["all", "na", "emea", "apac"] as DashboardRegion[],
  channel: ["all", "paid", "organic", "partner"] as DashboardChannel[],
};

export function FilterBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filters = parseDashboardFilters(searchParams);

  function updateFilter<K extends keyof typeof filterOptions>(key: K, value: (typeof filterOptions)[K][number]) {
    const next = toDashboardSearchParams({
      ...filters,
      [key]: value,
    });

    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <section className="rounded-brutal border-4 border-line bg-panel-muted p-6 text-ink shadow-brutal">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/70">Global Filters</p>
          <p className="mt-1 text-sm font-medium text-ink/75">URL params drive the dashboard state.</p>
        </div>
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="rounded-full border-2 border-line bg-panel px-3 py-1 text-sm font-bold"
        >
          Reset
        </button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <FilterSelect label="Window" value={filters.scope} options={filterOptions.scope} onChange={(value) => updateFilter("scope", value)} />
        <FilterSelect label="Region" value={filters.region} options={filterOptions.region} onChange={(value) => updateFilter("region", value)} />
        <FilterSelect label="Channel" value={filters.channel} options={filterOptions.channel} onChange={(value) => updateFilter("channel", value)} />
      </div>
    </section>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-2xl border-4 border-line bg-panel px-4 py-3 font-bold capitalize outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
