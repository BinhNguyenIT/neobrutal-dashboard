import Link from "next/link";

import { DashboardFilters } from "@/lib/types";

function toDetailHref(filters: DashboardFilters) {
  const params = new URLSearchParams();

  params.set("scope", filters.scope);
  params.set("region", filters.region);
  params.set("channel", filters.channel);

  const query = params.toString();
  return query ? `/campaigns/northstar-search?${query}` : "/campaigns/northstar-search";
}

export function OverviewHeader({
  headline,
  subheadline,
  filters,
}: {
  headline: string;
  subheadline: string;
  filters: DashboardFilters;
}) {
  return (
    <section className="rounded-brutal border-4 border-line bg-panel p-6 text-ink shadow-brutal">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="rounded-full border-2 border-line bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          Overview
        </p>
        <Link
          href={toDetailHref(filters)}
          className="rounded-full border-2 border-line bg-panel-muted px-3 py-1 text-sm font-bold"
        >
          Drill down
        </Link>
      </div>
      <h1 className="max-w-xl text-4xl font-black uppercase leading-none sm:text-5xl">{headline}</h1>
      <p className="mt-4 max-w-2xl text-sm font-medium text-ink/75 sm:text-base">{subheadline}</p>
    </section>
  );
}
