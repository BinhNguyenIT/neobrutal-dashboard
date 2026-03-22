import { tasksViewFixture } from "@/lib/workflow/fixtures";
import { createMockWorkflowRepository } from "@/lib/workflow/repository";
import { buildWorkflowDerivedData, filterTasks } from "@/lib/workflow/selectors";
import { initialTasksViewState, workflowViewReducer } from "@/lib/workflow/view-state";

describe("workflow selectors", () => {
  it("filters by search, priority, and tags over the same task universe", () => {
    const viewState = {
      ...initialTasksViewState,
      searchQuery: "stale",
      filters: {
        ...initialTasksViewState.filters,
        priority: "urgent" as const,
        tagIds: ["tag-review"],
      },
    };

    const tasks = filterTasks(tasksViewFixture.tasks, viewState);

    expect(tasks).toHaveLength(1);
    expect(tasks[0]?.id).toBe("task-03");
  });

  it("groups done tasks into descending completion-date accordions", () => {
    const derived = buildWorkflowDerivedData(tasksViewFixture, initialTasksViewState);

    expect(derived.boardColumns.done).toHaveLength(3);
    expect(derived.boardColumns.done[0]?.key).toBe("2026-03-22");
    expect(derived.boardColumns.done[1]?.key).toBe("2026-03-21");
    expect(derived.boardColumns.done[2]?.key).toBe("2026-03-20");
  });

  it("maps recurring statusLabel to a true localized status label", () => {
    const derived = buildWorkflowDerivedData(tasksViewFixture, initialTasksViewState);

    expect(derived.recurringCards.find((task) => task.id === "recurring-01")?.statusLabel).toBe("Active");
    expect(derived.recurringCards.find((task) => task.id === "recurring-02")?.statusLabel).toBe("Paused");
  });
});

describe("mock workflow repository", () => {
  it("mutates recurring task state for run, pause, and resume actions", async () => {
    const repository = createMockWorkflowRepository(tasksViewFixture);

    await repository.pauseRecurringTask("recurring-01");
    let payload = await repository.getTasksView();
    expect(payload.recurringTasks.find((task) => task.id === "recurring-01")?.status).toBe("paused");

    await repository.resumeRecurringTask("recurring-01");
    payload = await repository.getTasksView();
    expect(payload.recurringTasks.find((task) => task.id === "recurring-01")?.status).toBe("active");

    const beforeCount = payload.tasks.length;
    await repository.runRecurringTaskNow("recurring-01");
    payload = await repository.getTasksView();
    expect(payload.tasks).toHaveLength(beforeCount + 1);
    expect(payload.tasks[0]?.recurringTemplateId).toBe("recurring-01");
    expect(payload.tasks[0]?.status).toBe("todo");
  });
});

describe("workflow view reducer", () => {
  it("preserves filters when switching view modes", () => {
    const withAgent = workflowViewReducer(initialTasksViewState, {
      type: "set-agent-filter",
      value: "agent-orbit",
    });

    const switched = workflowViewReducer(withAgent, {
      type: "set-view-mode",
      value: "list",
    });

    expect(switched.viewMode).toBe("list");
    expect(switched.filters.agentId).toBe("agent-orbit");
  });

  it("opens create mode without wiping theme or locale state", () => {
    const themed = workflowViewReducer(initialTasksViewState, {
      type: "set-theme-mode",
      value: "dark",
    });
    const localized = workflowViewReducer(themed, {
      type: "set-locale",
      value: "vi",
    });
    const createOpen = workflowViewReducer(localized, {
      type: "open-create-task",
    });

    expect(createOpen.isCreateTaskOpen).toBe(true);
    expect(createOpen.themeMode).toBe("dark");
    expect(createOpen.locale).toBe("vi");
  });
});
