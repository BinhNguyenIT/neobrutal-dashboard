import { TasksViewState, ThemeMode, ViewMode } from "@/lib/workflow/types";

export const initialTasksViewState: TasksViewState = {
  viewMode: "board",
  searchQuery: "",
  filters: {
    agentId: "all",
    priority: "all",
    tagIds: [],
  },
  sidebarCollapsed: false,
  waitingExpanded: {
    blocked: true,
    inReview: true,
  },
  doneAccordion: {},
  selectedTaskId: null,
  themeMode: "system",
  locale: "en",
  isCreateTaskOpen: false,
  feedbackMessage: null,
};

type WorkflowViewAction =
  | { type: "set-view-mode"; value: ViewMode }
  | { type: "set-search-query"; value: string }
  | { type: "set-agent-filter"; value: string | "all" }
  | { type: "set-priority-filter"; value: TasksViewState["filters"]["priority"] }
  | { type: "toggle-tag-filter"; value: string }
  | { type: "toggle-sidebar" }
  | { type: "toggle-waiting-group"; value: keyof TasksViewState["waitingExpanded"] }
  | { type: "toggle-done-accordion"; value: string }
  | { type: "select-task"; value: string | null }
  | { type: "set-theme-mode"; value: ThemeMode }
  | { type: "set-locale"; value: TasksViewState["locale"] }
  | { type: "open-create-task" }
  | { type: "close-drawer" }
  | { type: "set-feedback"; value: string | null };

export function workflowViewReducer(state: TasksViewState, action: WorkflowViewAction): TasksViewState {
  switch (action.type) {
    case "set-view-mode":
      return { ...state, viewMode: action.value };
    case "set-search-query":
      return { ...state, searchQuery: action.value };
    case "set-agent-filter":
      return { ...state, filters: { ...state.filters, agentId: action.value } };
    case "set-priority-filter":
      return { ...state, filters: { ...state.filters, priority: action.value } };
    case "toggle-tag-filter": {
      const tagIds = state.filters.tagIds.includes(action.value)
        ? state.filters.tagIds.filter((tagId) => tagId !== action.value)
        : [...state.filters.tagIds, action.value];

      return { ...state, filters: { ...state.filters, tagIds } };
    }
    case "toggle-sidebar":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "toggle-waiting-group":
      return {
        ...state,
        waitingExpanded: {
          ...state.waitingExpanded,
          [action.value]: !state.waitingExpanded[action.value],
        },
      };
    case "toggle-done-accordion":
      return {
        ...state,
        doneAccordion: {
          ...state.doneAccordion,
          [action.value]: !state.doneAccordion[action.value],
        },
      };
    case "select-task":
      return {
        ...state,
        selectedTaskId: action.value,
        isCreateTaskOpen: false,
        feedbackMessage: null,
      };
    case "set-theme-mode":
      return { ...state, themeMode: action.value };
    case "set-locale":
      return { ...state, locale: action.value };
    case "open-create-task":
      return { ...state, isCreateTaskOpen: true, selectedTaskId: null };
    case "close-drawer":
      return { ...state, isCreateTaskOpen: false, selectedTaskId: null };
    case "set-feedback":
      return { ...state, feedbackMessage: action.value };
    default:
      return state;
  }
}
