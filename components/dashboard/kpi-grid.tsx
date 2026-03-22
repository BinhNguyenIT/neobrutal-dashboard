import { KpiMetric } from "@/lib/types";

export function KpiGrid({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.id} className="rounded-brutal border-4 border-line bg-panel p-5 text-ink shadow-brutal">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/60">{metric.label}</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-3xl font-black sm:text-4xl">{metric.value}</p>
            <span
              className={`rounded-full border-2 border-line px-3 py-1 text-sm font-black ${
                metric.deltaTone === "up"
                  ? "bg-accent-2"
                  : metric.deltaTone === "down"
                    ? "bg-danger text-ink-inverse"
                    : "bg-panel-muted"
              }`}
            >
              {metric.delta}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-ink/70">{metric.note}</p>
        </article>
      ))}
    </section>
  );
}
