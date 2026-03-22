export type LocaleOption = "en" | "vi";
export type ThemeMode = "light" | "dark" | "system";
export type ViewMode = "board" | "list";
export type AgentRoleLabel = "General" | "Coder" | "Analyst" | "Writer";
export type PresenceState = "online" | "offline";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type RecurringStatus = "active" | "paused";

export interface TaskEntity {
  id: string;
  title: string;
  brief?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeAgentId: string | null;
  tagIds: string[];
  timeTrackingLabel: string;
  startedAt?: string | null;
  completedAt?: string | null;
  recurringTemplateId?: string | null;
}

export interface RecurringTaskEntity {
  id: string;
  title: string;
  scheduleLabel: string;
  startsAt: string;
  nextRunAt: string;
  status: RecurringStatus;
  defaultAgentId?: string | null;
}

export interface AgentEntity {
  id: string;
  displayName: string;
  roleLabel: AgentRoleLabel;
  presence: PresenceState;
  avatarSeed?: string;
}

export interface TagEntity {
  id: string;
  label: string;
}

export interface TasksViewPayload {
  tasks: TaskEntity[];
  recurringTasks: RecurringTaskEntity[];
  agents: AgentEntity[];
  availableTags: TagEntity[];
  systemStatus: {
    server: "ready" | "degraded" | "offline";
    label: string;
  };
  userProfile: {
    displayName: string;
    plan: string;
    email: string;
  };
}

export interface DashboardViewPayload {
  summary: {
    openCount: number;
    inProgressCount: number;
    waitingCount: number;
    doneTodayCount: number;
  };
  recentTasks: TaskEntity[];
  recurringPreview: RecurringTaskEntity[];
  agents: AgentEntity[];
}

export interface UIActionResult {
  ok: boolean;
  message?: string;
}

export interface TaskStatusTransitionInput {
  taskId: string;
  nextStatus: TaskStatus;
}

export interface WorkflowViewRepository {
  getTasksView(): Promise<TasksViewPayload>;
  getDashboardView(): Promise<DashboardViewPayload>;
  runRecurringTaskNow(taskId: string): Promise<UIActionResult>;
  pauseRecurringTask(taskId: string): Promise<UIActionResult>;
  resumeRecurringTask(taskId: string): Promise<UIActionResult>;
  updateTaskStatus(input: TaskStatusTransitionInput): Promise<UIActionResult>;
}

export interface TasksViewState {
  viewMode: ViewMode;
  searchQuery: string;
  filters: {
    agentId: string | "all";
    priority: "all" | TaskPriority;
    tagIds: string[];
  };
  sidebarCollapsed: boolean;
  waitingExpanded: {
    blocked: boolean;
    inReview: boolean;
  };
  doneAccordion: Record<string, boolean>;
  selectedTaskId: string | null;
  themeMode: ThemeMode;
  locale: LocaleOption;
  isCreateTaskOpen: boolean;
  feedbackMessage: string | null;
}

export interface TaskPresentationModel {
  id: string;
  title: string;
  brief?: string;
  status: TaskStatus;
  statusLabel: string;
  priority: TaskPriority;
  priorityLabel: string;
  assigneeName: string;
  assigneeRole: AgentRoleLabel | null;
  presence: PresenceState | null;
  tagLabels: string[];
  timeTrackingLabel: string;
  completedDateKey: string | null;
  completedDateLabel: string | null;
  recurringTemplateId: string | null;
}

export interface RecurringPresentationModel {
  id: string;
  title: string;
  scheduleLabel: string;
  startsLabel: string;
  nextRunLabel: string;
  status: RecurringStatus;
  statusLabel: string;
  defaultAgentName: string;
}

export interface AgentRosterItemModel {
  id: string;
  displayName: string;
  roleLabel: AgentRoleLabel;
  presence: PresenceState;
  initials: string;
  activeTaskCount: number;
}

export interface DashboardSummaryModel {
  openCount: number;
  inProgressCount: number;
  waitingCount: number;
  doneTodayCount: number;
}

export interface DoneGroupModel {
  key: string;
  label: string;
  tasks: TaskPresentationModel[];
}

export interface WorkflowDerivedData {
  filteredTasks: TaskPresentationModel[];
  recurringCards: RecurringPresentationModel[];
  boardColumns: {
    todo: TaskPresentationModel[];
    inProgress: TaskPresentationModel[];
    waiting: {
      blocked: TaskPresentationModel[];
      inReview: TaskPresentationModel[];
    };
    done: DoneGroupModel[];
  };
  listRows: TaskPresentationModel[];
  dashboardSummary: DashboardSummaryModel;
  recentTasks: TaskPresentationModel[];
  upcomingRecurringRuns: RecurringPresentationModel[];
  agentRosterDisplay: AgentRosterItemModel[];
  selectedTask: TaskPresentationModel | null;
}
