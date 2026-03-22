import { copy, localeMap, taskPriorityLabels, taskStatusLabels } from "@/lib/workflow/i18n";
import {
  AgentEntity,
  AgentRosterItemModel,
  DashboardSummaryModel,
  DoneGroupModel,
  RecurringPresentationModel,
  TagEntity,
  TaskEntity,
  TaskPresentationModel,
  TasksViewPayload,
  TasksViewState,
  WorkflowDerivedData,
} from "@/lib/workflow/types";

function sortTasks(tasks: TaskPresentationModel[]) {
  return [...tasks].sort((left, right) => {
    const leftDate = left.completedDateKey ?? "";
    const rightDate = right.completedDateKey ?? "";

    if (left.status === "done" && right.status === "done" && leftDate !== rightDate) {
      return rightDate.localeCompare(leftDate);
    }

    return left.title.localeCompare(right.title);
  });
}

function formatDateLabel(value: string, locale: TasksViewState["locale"], options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(localeMap[locale], options).format(new Date(value));
}

function getDateKey(value: string) {
  return value.slice(0, 10);
}

export function mapTaskToPresentation(
  task: TaskEntity,
  agents: AgentEntity[],
  tags: TagEntity[],
  locale: TasksViewState["locale"],
): TaskPresentationModel {
  const assignee = agents.find((agent) => agent.id === task.assigneeAgentId) ?? null;
  const completedDateKey = task.completedAt ? getDateKey(task.completedAt) : null;

  return {
    id: task.id,
    title: task.title,
    brief: task.brief,
    status: task.status,
    statusLabel: taskStatusLabels[locale][task.status],
    priority: task.priority,
    priorityLabel: taskPriorityLabels[locale][task.priority],
    assigneeName: assignee?.displayName ?? copy[locale].unassigned,
    assigneeRole: assignee?.roleLabel ?? null,
    presence: assignee?.presence ?? null,
    tagLabels: task.tagIds
      .map((tagId) => tags.find((tag) => tag.id === tagId)?.label)
      .filter((label): label is string => Boolean(label)),
    timeTrackingLabel: task.timeTrackingLabel,
    completedDateKey,
    completedDateLabel: task.completedAt
      ? formatDateLabel(task.completedAt, locale, { month: "short", day: "numeric", year: "numeric" })
      : null,
    recurringTemplateId: task.recurringTemplateId ?? null,
  };
}

export function filterTasks(tasks: TaskEntity[], viewState: TasksViewState) {
  const search = viewState.searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch =
      search.length === 0 ||
      task.title.toLowerCase().includes(search) ||
      task.brief?.toLowerCase().includes(search) ||
      task.tagIds.some((tagId) => tagId.toLowerCase().includes(search));

    const matchesAgent = viewState.filters.agentId === "all" || task.assigneeAgentId === viewState.filters.agentId;
    const matchesPriority = viewState.filters.priority === "all" || task.priority === viewState.filters.priority;
    const matchesTags =
      viewState.filters.tagIds.length === 0 ||
      viewState.filters.tagIds.some((tagId) => task.tagIds.includes(tagId));

    return matchesSearch && matchesAgent && matchesPriority && matchesTags;
  });
}

export function buildDashboardSummary(tasks: TaskPresentationModel[]): DashboardSummaryModel {
  const doneTodayKey = new Date().toISOString().slice(0, 10);

  return {
    openCount: tasks.filter((task) => task.status !== "done").length,
    inProgressCount: tasks.filter((task) => task.status === "in_progress").length,
    waitingCount: tasks.filter((task) => task.status === "blocked" || task.status === "in_review").length,
    doneTodayCount: tasks.filter((task) => task.status === "done" && task.completedDateKey === doneTodayKey).length,
  };
}

export function buildDoneGroups(tasks: TaskPresentationModel[]): DoneGroupModel[] {
  const grouped = tasks
    .filter((task) => task.status === "done" && task.completedDateKey && task.completedDateLabel)
    .reduce<Map<string, DoneGroupModel>>((accumulator, task) => {
      const existing = accumulator.get(task.completedDateKey!);

      if (existing) {
        existing.tasks.push(task);
      } else {
        accumulator.set(task.completedDateKey!, {
          key: task.completedDateKey!,
          label: task.completedDateLabel!,
          tasks: [task],
        });
      }

      return accumulator;
    }, new Map());

  return [...grouped.values()]
    .sort((left, right) => right.key.localeCompare(left.key))
    .map((group) => ({ ...group, tasks: sortTasks(group.tasks) }));
}

export function buildAgentRoster(agents: AgentEntity[], tasks: TaskPresentationModel[]): AgentRosterItemModel[] {
  return agents.map((agent) => ({
    id: agent.id,
    displayName: agent.displayName,
    roleLabel: agent.roleLabel,
    presence: agent.presence,
    initials: agent.displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    activeTaskCount: tasks.filter((task) => task.assigneeName === agent.displayName && task.status !== "done").length,
  }));
}

export function buildRecurringCards(payload: TasksViewPayload, locale: TasksViewState["locale"]): RecurringPresentationModel[] {
  const strings = copy[locale];

  return payload.recurringTasks.map((task) => ({
    id: task.id,
    title: task.title,
    scheduleLabel: task.scheduleLabel,
    startsLabel: formatDateLabel(task.startsAt, locale, { month: "short", day: "numeric" }),
    nextRunLabel: formatDateLabel(task.nextRunAt, locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: task.status,
    statusLabel: task.status === "active" ? strings.active : strings.paused,
    defaultAgentName:
      payload.agents.find((agent) => agent.id === task.defaultAgentId)?.displayName ?? strings.unassigned,
  }));
}

export function buildWorkflowDerivedData(payload: TasksViewPayload, viewState: TasksViewState): WorkflowDerivedData {
  const filteredTaskEntities = filterTasks(payload.tasks, viewState);
  const filteredTasks = sortTasks(
    filteredTaskEntities.map((task) => mapTaskToPresentation(task, payload.agents, payload.availableTags, viewState.locale)),
  );
  const doneGroups = buildDoneGroups(filteredTasks);

  return {
    filteredTasks,
    recurringCards: buildRecurringCards(payload, viewState.locale),
    boardColumns: {
      todo: filteredTasks.filter((task) => task.status === "todo"),
      inProgress: filteredTasks.filter((task) => task.status === "in_progress"),
      waiting: {
        blocked: filteredTasks.filter((task) => task.status === "blocked"),
        inReview: filteredTasks.filter((task) => task.status === "in_review"),
      },
      done: doneGroups,
    },
    listRows: filteredTasks,
    dashboardSummary: buildDashboardSummary(filteredTasks),
    recentTasks: [...filteredTasks].slice(0, 6),
    upcomingRecurringRuns: buildRecurringCards(payload, viewState.locale).slice(0, 4),
    agentRosterDisplay: buildAgentRoster(
      payload.agents,
      payload.tasks.map((task) => mapTaskToPresentation(task, payload.agents, payload.availableTags, viewState.locale)),
    ),
    selectedTask:
      filteredTasks.find((task) => task.id === viewState.selectedTaskId) ??
      payload.tasks
        .map((task) => mapTaskToPresentation(task, payload.agents, payload.availableTags, viewState.locale))
        .find((task) => task.id === viewState.selectedTaskId) ??
      null,
  };
}
