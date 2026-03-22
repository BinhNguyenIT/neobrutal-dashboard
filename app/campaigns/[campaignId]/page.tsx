import Link from "next/link";

import { parseDashboardFilters, toDashboardSearchParams } from "@/lib/dashboard-filters";

export default async function CampaignDetail({
  params,
  searchParams,
}: {
  params: Promise<{ campaignId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { campaignId } = await params;
  const resolvedSearchParams = await searchParams;
  const filters = parseDashboardFilters(resolvedSearchParams);
  const backQuery = toDashboardSearchParams(filters).toString();
  const backHref = backQuery ? `/?${backQuery}` : "/";

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <section className="rounded-brutal border-4 border-line bg-panel p-6 text-ink shadow-brutal">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/60">Detail Route</p>
        <h1 className="mt-3 text-4xl font-black uppercase">{campaignId.replace(/-/g, " ")}</h1>
        <p className="mt-4 max-w-2xl font-medium text-ink/75">
          This route is intentionally lightweight. It gives the scaffold a drill-down destination without introducing backend dependencies.
        </p>
        <Link
          href={backHref}
          className="mt-6 inline-flex rounded-full border-2 border-line bg-accent px-4 py-2 text-sm font-black uppercase"
        >
          Back to overview
        </Link>
      </section>
    </main>
  );
}
