import { severityStyles } from "@/lib/theme";
import { AlertItem } from "@/lib/types";

export function AlertsStrip({ alerts }: { alerts: AlertItem[] }) {
  return (
    <section className="overflow-hidden rounded-brutal border-4 border-line bg-panel shadow-brutal">
      <div className="flex flex-wrap items-stretch">
        {alerts.map((alert) => (
          <article key={alert.id} className={`min-w-[240px] flex-1 border-b-4 border-line p-4 text-sm last:border-b-0 md:border-b-0 md:border-r-4 md:last:border-r-0 ${severityStyles[alert.severity]}`}>
            <p className="text-xs font-black uppercase tracking-[0.18em]">{alert.title}</p>
            <p className="mt-2 font-medium opacity-90">{alert.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
