"use client";

import clsx from "clsx";

import { copy } from "@/lib/workflow/i18n";
import { useWorkflow } from "@/components/workflow/workflow-provider";

export function DashboardPage() {
  const { payload, derived, loading, viewState, selectTask } = useWorkflow();
  const strings = copy[viewState.locale];

  if (loading || !payload || !derived) {
    return <div className="glass-panel-strong p-6 text-sm text-muted">{strings.loadingDashboard}</div>;
  }

  const metrics = [
    { label: strings.openTasks, value: derived.dashboardSummary.openCount, tone: "accent" },
    { label: strings.inProgress, value: derived.dashboardSummary.inProgressCount, tone: "mint" },
    { label: strings.waiting, value: derived.dashboardSummary.waitingCount, tone: "warm" },
    { label: strings.doneToday, value: derived.dashboardSummary.doneTodayCount, tone: "gold" },
  ] as const;

  const tones = {
    accent: "bg-[color:var(--status-todo)] text-[color:var(--line-strong)]",
    mint: "bg-[color:var(--status-progress)] text-[color:var(--line-strong)]",
    warm: "bg-[color:var(--status-blocked)] text-[color:var(--line-strong)]",
    gold: "bg-[color:var(--status-done)] text-[color:var(--line-strong)]",
  } as const;

  return (
    <div className="space-y-4">
      <section className="glass-panel-strong p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-soft">{strings.summary}</p>
        <h1 className="mt-2 text-3xl">{strings.snapshot}</h1>
        <p className="mt-2 text-sm text-muted">{strings.snapshotSubhead}</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="glass-panel-strong p-5">
            <span className={clsx("neo-badge inline-flex px-3 py-1 text-xs", tones[metric.tone])}>{metric.label}</span>
            <p className="mt-5 text-4xl font-semibold">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_1fr_1fr]">
        <article className="glass-panel-strong p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl">{strings.roster}</h2>
            <span className="text-sm text-muted">{derived.agentRosterDisplay.filter((agent) => agent.presence === "online").length} {strings.online}</span>
          </div>
          <div className="space-y-3">
            {derived.agentRosterDisplay.map((agent) => (
              <div key={agent.id} className="neo-inset flex items-center gap-3 px-4 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border-[2px] border-[var(--line)] bg-[color:var(--surface-raised)] text-sm font-extrabold">
                  {agent.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{agent.displayName}</p>
                  <p className="text-sm text-muted">
                    {agent.roleLabel} · {agent.activeTaskCount} {strings.open}
                  </p>
                </div>
                <span className={clsx("h-3 w-3 rounded-full", agent.presence === "online" ? "bg-[color:var(--success)]" : "bg-[color:var(--text-soft)]")} />
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel-strong p-5">
          <h2 className="text-xl">{strings.recentTasks}</h2>
          <div className="mt-4 space-y-3">
            {derived.recentTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => selectTask(task.id)}
                className="neo-card neo-focus flex w-full flex-col px-4 py-3 text-left transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <span className="text-sm font-medium">{task.title}</span>
                <span className="mt-1 text-sm text-muted">
                  {task.statusLabel} · {task.assigneeName}
                </span>
              </button>
            ))}
          </div>
        </article>

        <article className="glass-panel-strong p-5">
          <h2 className="text-xl">{strings.upcomingRuns}</h2>
          <div className="mt-4 space-y-3">
            {derived.upcomingRecurringRuns.map((task) => (
              <div key={task.id} className="neo-inset px-4 py-3">
                <span className="text-sm font-medium">{task.title}</span>
                <p className="mt-1 text-sm text-muted">{task.scheduleLabel}</p>
                <p className="mt-1 text-sm text-muted">{strings.nextRun}: {task.nextRunLabel}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
