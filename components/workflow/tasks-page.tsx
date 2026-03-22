"use client";

import { ReactNode } from "react";
import clsx from "clsx";

import { copy, taskPriorityLabels, taskStatusLabels } from "@/lib/workflow/i18n";
import { TaskPresentationModel } from "@/lib/workflow/types";
import { useWorkflow } from "@/components/workflow/workflow-provider";

function PriorityBadge({ priority, label }: { priority: TaskPresentationModel["priority"]; label: string }) {
  const tones = {
    low: "bg-[color:var(--accent-mint)] text-[color:var(--line-strong)]",
    medium: "bg-[color:var(--status-progress)] text-[color:var(--line-strong)]",
    high: "bg-[color:var(--accent-warm)] text-[color:var(--line-strong)]",
    urgent: "bg-[color:var(--status-blocked)] text-[color:var(--line-strong)]",
  } as const;

  return <span className={clsx("neo-badge px-3 py-1 text-xs", tones[priority])}>{label}</span>;
}

function StatusBadge({ status, label }: { status: TaskPresentationModel["status"]; label: string }) {
  const tones = {
    todo: "bg-[color:var(--status-todo)] text-[color:var(--line-strong)]",
    in_progress: "bg-[color:var(--status-progress)] text-[color:var(--line-strong)]",
    blocked: "bg-[color:var(--status-blocked)] text-[color:var(--line-strong)]",
    in_review: "bg-[color:var(--status-review)] text-[color:var(--line-strong)]",
    done: "bg-[color:var(--status-done)] text-[color:var(--line-strong)]",
  } as const;

  return <span className={clsx("neo-badge px-3 py-1 text-xs", tones[status])}>{label}</span>;
}

function TaskCard({ task, onOpen }: { task: TaskPresentationModel; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="neo-panel-strong neo-focus flex w-full flex-col gap-3 p-4 text-left transition hover:-translate-x-0.5 hover:-translate-y-0.5"
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
          <span key={tag} className="neo-chip px-3 py-1 text-xs">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

function EmptyGroup({ label }: { label: string }) {
  return <div className="neo-empty px-4 py-5 text-sm text-muted">{label}</div>;
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
    <section className="glass-panel p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base">{title}</h2>
        <span className="neo-badge bg-[color:var(--surface-raised)] px-3 py-1 text-xs">{count}</span>
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
    return <div className="glass-panel-strong p-6 text-sm text-muted">{strings.loadingWorkflow}</div>;
  }

  const activeFilters = [
    viewState.filters.agentId !== "all" ? payload.agents.find((agent) => agent.id === viewState.filters.agentId)?.displayName : null,
    viewState.filters.priority !== "all" ? taskPriorityLabels[viewState.locale][viewState.filters.priority] : null,
    ...viewState.filters.tagIds.map((tagId) => payload.availableTags.find((tag) => tag.id === tagId)?.label ?? null),
  ].filter((value): value is string => Boolean(value));

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <section className="glass-panel-strong p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">{strings.recurring}</p>
              <h1 className="mt-1 text-2xl">{strings.workspace}</h1>
              <p className="mt-2 text-sm text-muted">{strings.workspaceSubhead}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearFeedback();
                void refreshData();
              }}
              className="neo-button neo-focus px-4 py-2 text-sm text-muted"
            >
              {strings.refresh}
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {derived.recurringCards.map((task) => (
              <article key={task.id} className="neo-card p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="neo-badge bg-[color:var(--surface-raised)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                    {strings.fixedSchedule}
                  </span>
                  <span
                    className={clsx(
                      "neo-badge px-3 py-1 text-[11px] uppercase tracking-[0.2em]",
                      task.status === "active"
                        ? "bg-[color:var(--status-done)] text-[color:var(--line-strong)]"
                        : "bg-[color:var(--status-disabled)] text-[color:var(--line-strong)]",
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
                    className="neo-button neo-button-muted neo-focus px-3 py-2 text-xs text-muted"
                  >
                    {strings.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleRecurringTask(task.id, task.status)}
                    className="neo-button neo-button-muted neo-focus px-3 py-2 text-xs text-muted"
                  >
                    {task.status === "active" ? strings.pause : strings.resume}
                  </button>
                  <button
                    type="button"
                    onClick={() => void runRecurringTaskNow(task.id)}
                    className="neo-button neo-button-primary neo-focus px-3 py-2 text-xs"
                  >
                    {strings.forceRun}
                  </button>
                  <button
                    type="button"
                    onClick={() => void refreshData()}
                    className="neo-button neo-button-muted neo-focus px-3 py-2 text-xs text-muted"
                  >
                    {strings.refresh}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel-strong p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">{strings.activeFilters}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeFilters.length > 0 ? (
                    activeFilters.map((filter) => (
                      <span key={filter} className="neo-chip px-3 py-1 text-xs">
                        {filter}
                      </span>
                    ))
                  ) : (
                    <span className="neo-chip px-3 py-1 text-xs">{strings.none}</span>
                  )}
                </div>
              </div>
              {viewState.feedbackMessage ? (
                <button
                  type="button"
                  onClick={clearFeedback}
                  className="neo-badge bg-[color:var(--status-done)] px-4 py-2 text-sm text-[color:var(--line-strong)]"
                >
                  {viewState.feedbackMessage}
                </button>
              ) : null}
            </div>

            {derived.filteredTasks.length === 0 ? (
              <div className="neo-empty px-4 py-8 text-center text-sm text-muted">
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
                        <div key={groupKey} className="neo-inset p-3">
                          <button
                            type="button"
                            onClick={() => toggleWaitingGroup(groupKey)}
                            className="neo-focus flex w-full items-center justify-between text-left"
                          >
                            <span className="text-sm font-medium">
                              {groupKey === "blocked" ? strings.blocked : strings.inReview}
                            </span>
                            <span className="text-xs text-[color:var(--text)]">{collection.length}</span>
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
                        <div key={group.key} className="neo-inset p-3">
                          <button
                            type="button"
                            onClick={() => toggleDoneAccordion(group.key)}
                            className="neo-focus flex w-full items-center justify-between text-left"
                          >
                            <span className="text-sm font-medium">{group.label}</span>
                            <span className="text-xs text-[color:var(--text)]">{group.tasks.length}</span>
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
              <div className="overflow-hidden rounded-[10px] border-[3px] border-[var(--line-strong)] bg-[color:var(--surface)] shadow-[6px_6px_0_0_var(--line-strong)]">
                <div className="grid grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] gap-3 bg-[color:var(--surface-raised)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-muted">
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
                    className="neo-focus grid w-full grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] gap-3 border-t-[2px] border-[var(--line)] px-4 py-4 text-left transition hover:bg-[color:var(--surface-contrast)]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{task.title}</span>
                      <span className="block truncate text-sm text-muted">{task.brief}</span>
                    </span>
                    <span className="text-sm text-[color:var(--text-muted)]">{task.statusLabel}</span>
                    <span className="text-sm text-[color:var(--text-muted)]">{task.priorityLabel}</span>
                    <span className="text-sm text-[color:var(--text-muted)]">{task.assigneeName}</span>
                    <span className="text-sm text-[color:var(--text-muted)]">{task.timeTrackingLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="glass-panel-strong h-fit p-5">
        {viewState.isCreateTaskOpen ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-soft">{strings.createTask}</p>
                <h2 className="mt-1 text-xl">{strings.draftTask}</h2>
              </div>
              <button type="button" onClick={closeDrawer} className="neo-button neo-button-muted neo-focus px-3 py-2 text-sm text-muted">
                {strings.close}
              </button>
            </div>
            <div className="neo-inset p-4 text-sm text-muted">{strings.createTaskHint}</div>
          </div>
        ) : derived.selectedTask ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">{strings.selectedTask}</p>
                <h2 className="mt-1 text-xl">{derived.selectedTask.title}</h2>
              </div>
              <button type="button" onClick={closeDrawer} className="neo-button neo-button-muted neo-focus px-3 py-2 text-sm text-muted">
                {strings.close}
              </button>
            </div>
            {derived.selectedTask.brief ? <p className="text-sm text-muted">{derived.selectedTask.brief}</p> : null}
            <div className="neo-inset grid gap-3 p-4 text-sm text-[color:var(--text-muted)]">
              <p>{strings.status}: {derived.selectedTask.statusLabel}</p>
              <p>{strings.priority}: {derived.selectedTask.priorityLabel}</p>
              <p>{strings.assignee}: {derived.selectedTask.assigneeName}</p>
              <p>{strings.tags}: {derived.selectedTask.tagLabels.join(", ") || strings.none}</p>
              <p>{strings.time}: {derived.selectedTask.timeTrackingLabel}</p>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">{strings.transitions}</p>
              <div className="flex flex-wrap gap-2">
                {allowedTransitions(derived.selectedTask.status).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void updateTaskStatus(derived.selectedTask!.id, status)}
                    className="neo-button neo-button-muted neo-focus px-3 py-2 text-xs text-[color:var(--text)]"
                  >
                    {taskStatusLabels[viewState.locale][status]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="neo-inset p-4 text-sm text-muted">{strings.noSelection}</div>
        )}
      </aside>
    </div>
  );
}
