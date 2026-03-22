import { tasksViewFixture } from "@/lib/workflow/fixtures";
import { buildDashboardSummary } from "@/lib/workflow/selectors";
import {
  DashboardViewPayload,
  TaskEntity,
  TaskStatusTransitionInput,
  TasksViewPayload,
  UIActionResult,
  WorkflowViewRepository,
} from "@/lib/workflow/types";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function buildDashboardPayload(payload: TasksViewPayload): DashboardViewPayload {
  const recentTasks = [...payload.tasks].slice(0, 6);
  const recurringPreview = [...payload.recurringTasks].slice(0, 4);
  const taskPresentation = payload.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    brief: task.brief,
    status: task.status,
    statusLabel: task.status,
    priority: task.priority,
    priorityLabel: task.priority,
    assigneeName: payload.agents.find((agent) => agent.id === task.assigneeAgentId)?.displayName ?? "Unassigned",
    assigneeRole: payload.agents.find((agent) => agent.id === task.assigneeAgentId)?.roleLabel ?? null,
    presence: payload.agents.find((agent) => agent.id === task.assigneeAgentId)?.presence ?? null,
    tagLabels: task.tagIds,
    timeTrackingLabel: task.timeTrackingLabel,
    completedDateKey: task.completedAt?.slice(0, 10) ?? null,
    completedDateLabel: task.completedAt?.slice(0, 10) ?? null,
    recurringTemplateId: task.recurringTemplateId ?? null,
  }));

  return {
    summary: buildDashboardSummary(taskPresentation),
    recentTasks,
    recurringPreview,
    agents: payload.agents,
  };
}

export function createMockWorkflowRepository(seed: TasksViewPayload = tasksViewFixture): WorkflowViewRepository {
  let state = clone(seed);

  function updateTask(taskId: string, updater: (task: TaskEntity) => TaskEntity) {
    state = {
      ...state,
      tasks: state.tasks.map((task) => (task.id === taskId ? updater(task) : task)),
    };
  }

  return {
    async getTasksView() {
      return clone(state);
    },
    async getDashboardView() {
      return buildDashboardPayload(clone(state));
    },
    async runRecurringTaskNow(taskId: string): Promise<UIActionResult> {
      const recurringTask = state.recurringTasks.find((task) => task.id === taskId);

      if (!recurringTask) {
        return { ok: false, message: "Recurring task not found." };
      }

      const nextTask: TaskEntity = {
        id: `task-run-${Date.now()}`,
        title: `${recurringTask.title} run`,
        brief: "Generated from the frontend mock repository.",
        status: "todo",
        priority: "medium",
        assigneeAgentId: recurringTask.defaultAgentId ?? null,
        tagIds: ["tag-automation"],
        timeTrackingLabel: "less than a minute",
        recurringTemplateId: recurringTask.id,
      };

      state = {
        ...state,
        tasks: [nextTask, ...state.tasks],
      };

      return { ok: true, message: "Mock run created a fresh task in To Do." };
    },
    async pauseRecurringTask(taskId: string): Promise<UIActionResult> {
      const recurringTask = state.recurringTasks.find((task) => task.id === taskId);

      if (!recurringTask) {
        return { ok: false, message: "Recurring task not found." };
      }

      state = {
        ...state,
        recurringTasks: state.recurringTasks.map((task) =>
          task.id === taskId ? { ...task, status: "paused" } : task,
        ),
      };

      return { ok: true, message: "Recurring task paused in mock state." };
    },
    async resumeRecurringTask(taskId: string): Promise<UIActionResult> {
      const recurringTask = state.recurringTasks.find((task) => task.id === taskId);

      if (!recurringTask) {
        return { ok: false, message: "Recurring task not found." };
      }

      state = {
        ...state,
        recurringTasks: state.recurringTasks.map((task) =>
          task.id === taskId ? { ...task, status: "active" } : task,
        ),
      };

      return { ok: true, message: "Recurring task resumed in mock state." };
    },
    async updateTaskStatus({ taskId, nextStatus }: TaskStatusTransitionInput): Promise<UIActionResult> {
      const currentTask = state.tasks.find((task) => task.id === taskId);

      if (!currentTask) {
        return { ok: false, message: "Task not found." };
      }

      updateTask(taskId, (task) => ({
        ...task,
        status: nextStatus,
        startedAt: nextStatus === "in_progress" && !task.startedAt ? new Date().toISOString() : task.startedAt,
        completedAt: nextStatus === "done" ? new Date().toISOString() : nextStatus === "todo" ? null : task.completedAt ?? null,
      }));

      return { ok: true, message: `Task moved to ${nextStatus.replace("_", " ")}.` };
    },
  };
}
