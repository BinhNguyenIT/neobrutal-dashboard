"use client";

import { ReactNode } from "react";
import clsx from "clsx";

import { copy, taskPriorityLabels, taskStatusLabels } from "@/lib/workflow/i18n";
import { TaskPresentationModel } from "@/lib/workflow/types";
import { useWorkflow } from "@/components/workflow/workflow-provider";

function PriorityBadge({ priority, label }: { priority: TaskPresentationModel["priority"]; label: string }) {
  const tones = {
    low: "bg-[color:var(--accent-mint)]/35 text-[color:var(--success)]",
    medium: "bg-[color:var(--accent)]/18 text-[color:var(--accent-strong)]",
    high: "bg-[color:var(--accent-warm)]/28 text-[color:var(--warning)]",
    urgent: "bg-[color:var(--accent-rose)]/32 text-[color:var(--danger)]",
  } as const;

  return <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", tones[priority])}>{label}</span>;
}

function StatusBadge({ status, label }: { status: TaskPresentationModel["status"]; label: string }) {
  const tones = {
    todo: "bg-[color:var(--surface-contrast)] text-muted",
    in_progress: "bg-[color:var(--accent)]/18 text-[color:var(--accent-strong)]",
    blocked: "bg-[color:var(--accent-warm)]/28 text-[color:var(--warning)]",
    in_review: "bg-[color:var(--accent-gold)]/34 text-[color:var(--warning)]",
    done: "bg-[color:var(--accent-mint)]/30 text-[color:var(--success)]",
  } as const;

  return <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", tones[status])}>{label}</span>;
}

function TaskCard({ task, onOpen }: { task: TaskPresentationModel; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="glass-panel-strong flex w-full flex-col gap-3 rounded-[22px] p-4 text-left transition hover:-translate-y-0.5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} label={task.statusLabel} />
        <PriorityBadge priority={task.priority} label={task.priorityLabel} />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm">{task.title}</h3>
        {task.brief ? <p className="text-sm text-muted">{task.brief}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-soft">
        <span>{task.assigneeName}</span>
        <span>·</span>
        <span>{task.timeTrackingLabel}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {task.tagLabels.map((tag) => (
          <span key={tag} className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-1 text-xs text-muted">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

function EmptyGroup({ label }: { label: string }) {
  return <div className="rounded-[22px] border border-dashed border-[var(--line)] px-4 py-5 text-sm text-muted">{label}</div>;
}

function Column({
  title,
  children,
  count,
}: {
  title: string;
  children: ReactNode;
  count: number;
}) {
  return (
    <section className="glass-panel rounded-[28px] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base">{title}</h2>
        <span className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-1 text-xs text-muted">{count}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function TasksPage() {
  const {
    payload,
    derived,
    loading,
    viewState,
    allowedTransitions,
    selectTask,
    toggleWaitingGroup,
    toggleDoneAccordion,
    updateTaskStatus,
    runRecurringTaskNow,
    toggleRecurringTask,
    refreshData,
    closeDrawer,
    clearFeedback,
  } = useWorkflow();

  const strings = copy[viewState.locale];

  if (loading || !payload || !derived) {
    return <div className="glass-panel-strong rounded-[30px] p-6 text-sm text-muted">{strings.loadingWorkflow}</div>;
  }

  const activeFilters = [
    viewState.filters.agentId !== "all" ? payload.agents.find((agent) => agent.id === viewState.filters.agentId)?.displayName : null,
    viewState.filters.priority !== "all" ? taskPriorityLabels[viewState.locale][viewState.filters.priority] : null,
    ...viewState.filters.tagIds.map((tagId) => payload.availableTags.find((tag) => tag.id === tagId)?.label ?? null),
  ].filter((value): value is string => Boolean(value));

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <section className="glass-panel-strong rounded-[30px] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-soft">{strings.recurring}</p>
              <h1 className="mt-1 text-2xl">{strings.workspace}</h1>
              <p className="mt-2 text-sm text-muted">{strings.workspaceSubhead}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearFeedback();
                void refreshData();
              }}
              className="rounded-full border border-[var(--line)] bg-[color:var(--surface)] px-4 py-2 text-sm text-muted transition hover:text-[var(--text)]"
            >
              {strings.refresh}
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {derived.recurringCards.map((task) => (
              <article key={task.id} className="glass-panel rounded-[24px] p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-soft">
                    {strings.fixedSchedule}
                  </span>
                  <span
                    className={clsx(
                      "rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]",
                      task.status === "active"
                        ? "bg-[color:var(--accent-mint)]/28 text-[color:var(--success)]"
                        : "bg-[color:var(--accent-warm)]/24 text-[color:var(--warning)]",
                    )}
                  >
                    {task.statusLabel}
                  </span>
                </div>
                <h2 className="mt-4 text-base">{task.title}</h2>
                <p className="mt-1 text-sm text-muted">{task.scheduleLabel}</p>
                <div className="mt-4 grid gap-1 text-sm text-muted">
                  <p>{strings.starts}: {task.startsLabel}</p>
                  <p>{strings.nextRun}: {task.nextRunLabel}</p>
                  <p>{strings.defaultAgent}: {task.defaultAgentName}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => selectTask(payload.tasks.find((item) => item.recurringTemplateId === task.id)?.id ?? null)}
                    className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-2 text-xs text-muted transition hover:text-[var(--text)]"
                  >
                    {strings.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleRecurringTask(task.id, task.status)}
                    className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-2 text-xs text-muted transition hover:text-[var(--text)]"
                  >
                    {task.status === "active" ? strings.pause : strings.resume}
                  </button>
                  <button
                    type="button"
                    onClick={() => void runRecurringTaskNow(task.id)}
                    className="rounded-full bg-[color:var(--accent)] px-3 py-2 text-xs text-white"
                  >
                    {strings.forceRun}
                  </button>
                  <button
                    type="button"
                    onClick={() => void refreshData()}
                    className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-2 text-xs text-muted transition hover:text-[var(--text)]"
                  >
                    {strings.refresh}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel-strong rounded-[30px] p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-soft">{strings.activeFilters}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeFilters.length > 0 ? (
                    activeFilters.map((filter) => (
                      <span key={filter} className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-1 text-xs text-muted">
                        {filter}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-1 text-xs text-muted">{strings.none}</span>
                  )}
                </div>
              </div>
              {viewState.feedbackMessage ? (
                <button
                  type="button"
                  onClick={clearFeedback}
                  className="rounded-full bg-[color:var(--accent-mint)]/30 px-4 py-2 text-sm text-[color:var(--success)]"
                >
                  {viewState.feedbackMessage}
                </button>
              ) : null}
            </div>

            {derived.filteredTasks.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[var(--line)] px-4 py-8 text-center text-sm text-muted">
                {strings.noResults}
              </div>
            ) : viewState.viewMode === "board" ? (
              <div className="grid gap-4 xl:grid-cols-4">
                <Column title={strings.todo} count={derived.boardColumns.todo.length}>
                  {derived.boardColumns.todo.length > 0 ? (
                    derived.boardColumns.todo.map((task) => <TaskCard key={task.id} task={task} onOpen={() => selectTask(task.id)} />)
                  ) : (
                    <EmptyGroup label={strings.noTasks} />
                  )}
                </Column>

                <Column title={strings.inProgress} count={derived.boardColumns.inProgress.length}>
                  {derived.boardColumns.inProgress.length > 0 ? (
                    derived.boardColumns.inProgress.map((task) => (
                      <TaskCard key={task.id} task={task} onOpen={() => selectTask(task.id)} />
                    ))
                  ) : (
                    <EmptyGroup label={strings.noTasks} />
                  )}
                </Column>

                <Column
                  title={strings.waiting}
                  count={
                    derived.boardColumns.waiting.blocked.length + derived.boardColumns.waiting.inReview.length
                  }
                >
                  <div className="space-y-3">
                    {(["blocked", "inReview"] as const).map((groupKey) => {
                      const collection =
                        groupKey === "blocked" ? derived.boardColumns.waiting.blocked : derived.boardColumns.waiting.inReview;
                      const expanded = viewState.waitingExpanded[groupKey];

                      return (
                        <div key={groupKey} className="rounded-[22px] bg-[color:var(--surface)] p-3">
                          <button
                            type="button"
                            onClick={() => toggleWaitingGroup(groupKey)}
                            className="flex w-full items-center justify-between text-left"
                          >
                            <span className="text-sm font-medium">
                              {groupKey === "blocked" ? strings.blocked : strings.inReview}
                            </span>
                            <span className="text-xs text-muted">{collection.length}</span>
                          </button>
                          {expanded ? (
                            <div className="mt-3 space-y-3">
                              {collection.length > 0 ? (
                                collection.map((task) => <TaskCard key={task.id} task={task} onOpen={() => selectTask(task.id)} />)
                              ) : (
                                <EmptyGroup label={strings.noTasks} />
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </Column>

                <Column
                  title={strings.done}
                  count={derived.boardColumns.done.reduce((count, group) => count + group.tasks.length, 0)}
                >
                  {derived.boardColumns.done.length > 0 ? (
                    derived.boardColumns.done.map((group) => {
                      const expanded = viewState.doneAccordion[group.key] ?? true;

                      return (
                        <div key={group.key} className="rounded-[22px] bg-[color:var(--surface)] p-3">
                          <button
                            type="button"
                            onClick={() => toggleDoneAccordion(group.key)}
                            className="flex w-full items-center justify-between text-left"
                          >
                            <span className="text-sm font-medium">{group.label}</span>
                            <span className="text-xs text-muted">{group.tasks.length}</span>
                          </button>
                          {expanded ? (
                            <div className="mt-3 space-y-3">
                              {group.tasks.map((task) => (
                                <TaskCard key={task.id} task={task} onOpen={() => selectTask(task.id)} />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  ) : (
                    <EmptyGroup label={strings.noTasks} />
                  )}
                </Column>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[24px] border border-[var(--line)]">
                <div className="grid grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] gap-3 bg-[color:var(--surface-contrast)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-soft">
                  <span>{strings.task}</span>
                  <span>{strings.status}</span>
                  <span>{strings.priority}</span>
                  <span>{strings.assignee}</span>
                  <span>{strings.time}</span>
                </div>
                {derived.listRows.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => selectTask(task.id)}
                    className="grid w-full grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] gap-3 border-t border-[var(--line)] px-4 py-4 text-left transition hover:bg-[color:var(--surface)]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{task.title}</span>
                      <span className="block truncate text-sm text-muted">{task.brief}</span>
                    </span>
                    <span className="text-sm text-muted">{task.statusLabel}</span>
                    <span className="text-sm text-muted">{task.priorityLabel}</span>
                    <span className="text-sm text-muted">{task.assigneeName}</span>
                    <span className="text-sm text-muted">{task.timeTrackingLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="glass-panel-strong h-fit rounded-[30px] p-5">
        {viewState.isCreateTaskOpen ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-soft">{strings.createTask}</p>
                <h2 className="mt-1 text-xl">{strings.draftTask}</h2>
              </div>
              <button type="button" onClick={closeDrawer} className="text-sm text-muted">
                {strings.close}
              </button>
            </div>
            <div className="rounded-[24px] bg-[color:var(--surface)] p-4 text-sm text-muted">{strings.createTaskHint}</div>
          </div>
        ) : derived.selectedTask ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-soft">{strings.selectedTask}</p>
                <h2 className="mt-1 text-xl">{derived.selectedTask.title}</h2>
              </div>
              <button type="button" onClick={closeDrawer} className="text-sm text-muted">
                {strings.close}
              </button>
            </div>
            {derived.selectedTask.brief ? <p className="text-sm text-muted">{derived.selectedTask.brief}</p> : null}
            <div className="grid gap-3 rounded-[24px] bg-[color:var(--surface)] p-4 text-sm text-muted">
              <p>{strings.status}: {derived.selectedTask.statusLabel}</p>
              <p>{strings.priority}: {derived.selectedTask.priorityLabel}</p>
              <p>{strings.assignee}: {derived.selectedTask.assigneeName}</p>
              <p>{strings.tags}: {derived.selectedTask.tagLabels.join(", ") || strings.none}</p>
              <p>{strings.time}: {derived.selectedTask.timeTrackingLabel}</p>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-soft">{strings.transitions}</p>
              <div className="flex flex-wrap gap-2">
                {allowedTransitions(derived.selectedTask.status).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void updateTaskStatus(derived.selectedTask!.id, status)}
                    className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-2 text-xs text-muted transition hover:text-[var(--text)]"
                  >
                    {taskStatusLabels[viewState.locale][status]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] bg-[color:var(--surface)] p-4 text-sm text-muted">{strings.noSelection}</div>
        )}
      </aside>
    </div>
  );
}
