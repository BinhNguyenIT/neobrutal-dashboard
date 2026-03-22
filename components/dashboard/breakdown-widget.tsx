import { BreakdownItem } from "@/lib/types";

const tones = {
  accent: "bg-accent",
  success: "bg-accent-2",
  warning: "bg-accent-4",
} as const;

export function BreakdownWidget({ items }: { items: BreakdownItem[] }) {
  return (
    <section className="rounded-brutal border-4 border-line bg-panel p-5 text-ink shadow-brutal">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/60">Breakdown</p>
      <h2 className="mt-2 text-2xl font-black">Segment share</h2>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.segment}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-black uppercase">{item.segment}</span>
              <span className="text-sm font-bold">{item.value}%</span>
            </div>
            <div className="h-5 rounded-full border-2 border-line bg-panel-muted">
              <div className={`h-full rounded-full border-r-2 border-line ${tones[item.tone]}`} style={{ width: `${item.value}%` }} />
            </div>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/60">
              {item.change >= 0 ? "+" : ""}
              {item.change}% shift
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
