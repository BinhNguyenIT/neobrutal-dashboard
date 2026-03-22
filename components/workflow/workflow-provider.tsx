"use client";

import {
  createContext,
  ReactNode,
  startTransition,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { buildWorkflowDerivedData } from "@/lib/workflow/selectors";
import { createMockWorkflowRepository } from "@/lib/workflow/repository";
import { getAllowedTaskTransitions } from "@/lib/workflow/transitions";
import {
  TaskStatus,
  TasksViewPayload,
  TasksViewState,
  ThemeMode,
  UIActionResult,
  ViewMode,
  WorkflowDerivedData,
  WorkflowViewRepository,
} from "@/lib/workflow/types";
import { initialTasksViewState, workflowViewReducer } from "@/lib/workflow/view-state";

type WorkflowContextValue = {
  payload: TasksViewPayload | null;
  derived: WorkflowDerivedData | null;
  loading: boolean;
  viewState: TasksViewState;
  allowedTransitions: typeof getAllowedTaskTransitions;
  refreshData: () => Promise<void>;
  setSearchQuery: (value: string) => void;
  setAgentFilter: (value: string | "all") => void;
  setPriorityFilter: (value: TasksViewState["filters"]["priority"]) => void;
  toggleTagFilter: (value: string) => void;
  setViewMode: (value: ViewMode) => void;
  toggleSidebar: () => void;
  toggleWaitingGroup: (value: keyof TasksViewState["waitingExpanded"]) => void;
  toggleDoneAccordion: (value: string) => void;
  selectTask: (value: string | null) => void;
  setThemeMode: (value: ThemeMode) => void;
  setLocale: (value: TasksViewState["locale"]) => void;
  openCreateTask: () => void;
  closeDrawer: () => void;
  updateTaskStatus: (taskId: string, nextStatus: TaskStatus) => Promise<UIActionResult>;
  runRecurringTaskNow: (taskId: string) => Promise<UIActionResult>;
  toggleRecurringTask: (taskId: string, currentStatus: "active" | "paused") => Promise<UIActionResult>;
  clearFeedback: () => void;
};

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

function applyResolvedTheme(themeMode: ThemeMode) {
  const resolveTheme = () => {
    if (themeMode !== "system") {
      return themeMode;
    }

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  document.documentElement.dataset.theme = resolveTheme();
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const repositoryRef = useRef<WorkflowViewRepository | null>(null);
  const [payload, setPayload] = useState<TasksViewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewState, dispatch] = useReducer(workflowViewReducer, initialTasksViewState);
  const deferredSearchQuery = useDeferredValue(viewState.searchQuery);

  if (!repositoryRef.current) {
    repositoryRef.current = createMockWorkflowRepository();
  }

  const refreshData = useCallback(async () => {
    setLoading(true);
    const nextPayload = await repositoryRef.current!.getTasksView();
    setPayload(nextPayload);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  useEffect(() => {
    applyResolvedTheme(viewState.themeMode);

    if (viewState.themeMode !== "system") {
      return;
    }

    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyResolvedTheme("system");
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [viewState.themeMode]);

  useEffect(() => {
    document.documentElement.lang = viewState.locale;
  }, [viewState.locale]);

  const effectiveViewState = useMemo(
    () => ({
      ...viewState,
      searchQuery: deferredSearchQuery,
    }),
    [deferredSearchQuery, viewState],
  );

  const derived = useMemo(
    () => (payload ? buildWorkflowDerivedData(payload, effectiveViewState) : null),
    [effectiveViewState, payload],
  );

  const runAction = useCallback(
    async (runner: () => Promise<UIActionResult>) => {
      const result = await runner();
      await refreshData();

      startTransition(() => {
        dispatch({ type: "set-feedback", value: result.message ?? null });
      });

      return result;
    },
    [refreshData],
  );

  const value = useMemo<WorkflowContextValue>(
    () => ({
      payload,
      derived,
      loading,
      viewState,
      allowedTransitions: getAllowedTaskTransitions,
      refreshData,
      setSearchQuery: (value) => dispatch({ type: "set-search-query", value }),
      setAgentFilter: (value) => dispatch({ type: "set-agent-filter", value }),
      setPriorityFilter: (value) => dispatch({ type: "set-priority-filter", value }),
      toggleTagFilter: (value) => dispatch({ type: "toggle-tag-filter", value }),
      setViewMode: (value) => dispatch({ type: "set-view-mode", value }),
      toggleSidebar: () => dispatch({ type: "toggle-sidebar" }),
      toggleWaitingGroup: (value) => dispatch({ type: "toggle-waiting-group", value }),
      toggleDoneAccordion: (value) => dispatch({ type: "toggle-done-accordion", value }),
      selectTask: (value) => dispatch({ type: "select-task", value }),
      setThemeMode: (value) => dispatch({ type: "set-theme-mode", value }),
      setLocale: (value) => dispatch({ type: "set-locale", value }),
      openCreateTask: () => dispatch({ type: "open-create-task" }),
      closeDrawer: () => dispatch({ type: "close-drawer" }),
      updateTaskStatus: (taskId, nextStatus) =>
        runAction(() => repositoryRef.current!.updateTaskStatus({ taskId, nextStatus })),
      runRecurringTaskNow: (taskId) => runAction(() => repositoryRef.current!.runRecurringTaskNow(taskId)),
      toggleRecurringTask: (taskId, currentStatus) =>
        runAction(() =>
          currentStatus === "active"
            ? repositoryRef.current!.pauseRecurringTask(taskId)
            : repositoryRef.current!.resumeRecurringTask(taskId),
        ),
      clearFeedback: () => dispatch({ type: "set-feedback", value: null }),
    }),
    [derived, loading, payload, refreshData, runAction, viewState],
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const value = useContext(WorkflowContext);

  if (!value) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }

  return value;
}
