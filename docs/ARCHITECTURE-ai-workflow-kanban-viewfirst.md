# AI Workflow Kanban System - View-First Architecture Package

## 1. Architecture frame

### System / feature
AI Workflow Kanban System, current architecture slice: Tasks-first frontend surfaces with a lightweight Dashboard summary surface.

### Design goal
Provide an implementation-ready frontend architecture that lets the developer build the operator-facing dashboard and task orchestration UI now, using mock data and local view contracts, while explicitly deferring backend/service complexity.

### In-scope slice
- Global app shell information architecture
- Tasks page layout and interaction architecture
- Dashboard summary surface for current phase
- Shared view-state model
- Mock adapter and frontend data contracts
- UI presentation rules for task states, recurring tasks, agent presence, and time tracking
- Responsive, theming, and multilingual-ready guidance

### Explicitly out of scope for this package
- Real backend architecture
- Database schema
- API design for production services
- Agent orchestration internals
- Scheduler/cron engine behavior beyond UI affordances
- Production deployment
- Realtime collaboration

### Shortest path to first user-visible value
Build `/tasks` as the authoritative operator workspace with realistic mock data and local interactions, then expose a lightweight `/dashboard` that reuses the same derived read models.

### Primary proof metric for this slice
A downstream developer can implement the P0 UI without inventing missing behavior or coupling components to nonexistent backend semantics.

---

## 2. System context and boundaries

## 2.1 Actors and clients
- **Operator**: creates, filters, scans, and moves tasks
- **AI agent entity (display only in this phase)**: shown as assignee and presence state
- **Frontend application**: React-based operator UI
- **Mock adapter layer**: temporary source of truth for Tasks/Dashboard surfaces

## 2.2 Current-phase internal components
- App shell
- Tasks route
- Dashboard route
- Shared UI state store
- Derived selectors / view mappers
- Mock repository and fixtures
- Presentation components

## 2.3 Deferred external systems
- Task persistence service
- Agent registry/presence service
- Search service
- Recurring scheduler/cron service
- Time-tracking service
- Authentication/session service beyond existing app shell assumptions

## 2.4 Source of truth in this phase
The **frontend mock adapter layer** is the only source of truth during this stage. Components must not compute fake backend logic beyond view derivation and UI-only state transitions.

## 2.5 Sync vs async boundary
### In scope now
- Synchronous local actions
- Optimistic UI-only transitions
- Mock async wrappers for loading/error simulation

### Deferred
- Real network requests
- Retry rules
- Background jobs
- Event streams
- Scheduler execution

---

## 3. Architecture decisions

### AD-01: Frontend-first delivery shape
- **Decision:** Build the current slice as a frontend-only experience backed by a mock adapter/repository layer.
- **Chosen option:** Local mock repository with async-compatible interface.
- **Rationale:** Enables fast implementation of visible value while preventing accidental backend overbuild.
- **Alternatives considered:** Directly designing real API contracts now; hardcoded component-level mock arrays.
- **Impact:** UI can ship internally for review; backend remains replaceable later.
- **Reversibility:** High.

### AD-02: Tasks-first route ownership
- **Decision:** Make `/tasks` the authoritative workflow surface; `/dashboard` is summary-only in this phase.
- **Chosen option:** Shared adapter data feeding both routes, but interaction depth lives in Tasks.
- **Rationale:** Matches PRD priority and keeps design effort concentrated.
- **Alternatives considered:** Build Dashboard and Tasks equally deeply.
- **Impact:** Faster P0 delivery with lower ambiguity.
- **Reversibility:** High.

### AD-03: Shared view-state container
- **Decision:** Centralize route-level view preferences and filters in one page-scoped state container.
- **Chosen option:** Use a lightweight client store or reducer-based controller for search, filters, view mode, accordion state, sidebar state, theme/language bridge state, and selected task.
- **Rationale:** Preserves context consistently across board/list and auxiliary UI toggles.
- **Alternatives considered:** Independent local state per component.
- **Impact:** Lower risk of state desync.
- **Reversibility:** High.

### AD-04: View-model mapping layer
- **Decision:** Introduce a mapper layer between raw mock entities and rendered UI models.
- **Chosen option:** `entity -> derived view model` selectors for task cards, list rows, recurring cards, agent sidebar items, dashboard widgets.
- **Rationale:** Prevents presentation logic from leaking into components and makes backend swap easier later.
- **Alternatives considered:** Render raw entities directly.
- **Impact:** Slight upfront structure cost, cleaner future migration.
- **Reversibility:** Medium-high.

### AD-05: Waiting and Done are presentation groups
- **Decision:** Model `Waiting` and `Done by date` as view-layer groupings, not generic flat columns.
- **Chosen option:** Waiting groups by child status (`blocked`, `in_review`); Done groups by derived completion date buckets with accordion state.
- **Rationale:** Matches PRD exactly and keeps rendering behavior explicit.
- **Alternatives considered:** Flat status-only lists.
- **Impact:** Better readability and predictable implementation.
- **Reversibility:** Medium.

### AD-06: Task detail as an entry point, not a deep workflow system
- **Decision:** Provide a task detail drawer/modal entry point with read/edit-ready sections, but do not design full multi-step editing workflows yet.
- **Chosen option:** Single surface opened from board/list cards/rows with summary, metadata, assignee, tags, recurrence linkage, and status actions.
- **Rationale:** Gives room for detail/drill-down without overcommitting to backend forms.
- **Alternatives considered:** No detail surface in phase one; full dedicated task page.
- **Impact:** Better extensibility.
- **Reversibility:** High.

### AD-07: UI-only timers and recurring actions are representational
- **Decision:** Treat time tracking and recurring controls as display/action affordance contracts only.
- **Chosen option:** Render already-computed display values and mock action responses.
- **Rationale:** Prevents fake business logic from solidifying in the frontend.
- **Alternatives considered:** Simulate real timers/scheduling logic deeply in UI.
- **Impact:** Cleaner backend handoff later.
- **Reversibility:** High.

---

## 4. Frontend information architecture

## 4.1 Global navigation
Current route map for this phase:
- `/dashboard` - summary widgets, recent tasks snapshot, agent status snapshot
- `/tasks` - full workflow surface (primary implementation target)
- `/agents` - placeholder or existing route only
- `/notebooks` - placeholder or existing route only
- `/documents` - placeholder or existing route only
- `/settings` - preference shell or existing route only

### IA priority
1. Tasks
2. Dashboard
3. Other nav items as structural placeholders unless already implemented

## 4.2 Tasks page IA
Three persistent vertical layers:
1. **Top bar**: search, filters, view toggle, quick preferences, primary CTA
2. **Sidebar**: nav, agent roster, system status, account block
3. **Main workspace**: recurring strip + board/list surface + empty states + detail entry

### Main workspace order
1. Recurring tasks section
2. Current view controls/context summary (optional chip row)
3. Board or List surface
4. Task detail drawer/modal when invoked

## 4.3 Dashboard IA for this phase
The dashboard should stay intentionally lightweight and summary-driven:
- Header: greeting/title + same preference affordances if app shell supports them globally
- Summary cards:
  - total open tasks
  - in progress count
  - waiting count
  - done today count
- Agent readiness panel
- Recent tasks snapshot (top 5-8)
- Upcoming recurring runs snapshot (top 3-5)

No analytics-heavy charts are required in this phase.

---

## 5. Layout regions and component map

## 5.1 App shell component map
- `AppShell`
  - `Sidebar`
    - `PrimaryNav`
    - `TaskCountBadge`
    - `AgentRosterPanel`
      - `AgentRosterItem`
    - `SystemStatusCard`
    - `UserProfileCard`
  - `TopBar`
    - `GlobalSearchInput`
    - `FilterBar`
      - `AgentFilter`
      - `PriorityFilter`
      - `TagFilter`
    - `ViewModeToggle`
    - `ThemeToggle`
    - `LanguageToggle`
    - `NewTaskButton`
  - `RouteContent`

## 5.2 Tasks route component map
- `TasksPage`
  - `RecurringTasksSection`
    - `RecurringTaskCard[]`
    - `RecurringTaskActionMenu`
  - `ViewContextBar` (optional active chips / counts)
  - `TasksSurface`
    - `BoardView` or `ListView`
  - `TaskDetailDrawer | TaskDetailModal`
  - `CreateTaskEntryPoint`
  - `EmptyState | NoResultsState | MockErrorState`

### Board view structure
- `BoardView`
  - `ColumnToDo`
  - `ColumnInProgress`
  - `ColumnWaiting`
    - `WaitingGroupBlocked`
    - `WaitingGroupInReview`
  - `ColumnDone`
    - `DoneDateAccordion[]`
      - `TaskCard[]`

### List view structure
- `ListView`
  - `ListToolbarMeta` (count, sort placeholder if needed)
  - `TaskListTable | TaskListResponsiveList`
    - `TaskListRow[]`

## 5.3 Dashboard route component map
- `DashboardPage`
  - `SummaryMetricRow`
    - `MetricCard[]`
  - `AgentStatusPanel`
  - `RecentTasksPanel`
  - `UpcomingRecurringPanel`

---

## 6. View and state contract

## 6.1 Page-scoped state model
Recommended page-level state shape:

```ts
interface TasksViewState {
  viewMode: 'board' | 'list';
  searchQuery: string;
  filters: {
    agentId: string | 'all';
    priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
    tagIds: string[];
  };
  sidebarCollapsed: boolean;
  waitingExpanded: {
    blocked: boolean;
    inReview: boolean;
  };
  doneAccordion: Record<string, boolean>;
  selectedTaskId: string | null;
  themeMode: 'light' | 'dark' | 'system';
  locale: 'vi' | 'en';
}
```

### Rules
- Search/filter/view state must persist while switching between Board and List.
- Theme and locale changes must not wipe task view state.
- Accordion open/close state is UI-only and does not need backend persistence in this phase.
- Task detail open state is local UI state.

## 6.2 Derived collections
From mock entities, compute:
- `filteredTasks`
- `boardColumns`
- `waitingGroups`
- `doneGroupsByDate`
- `listRows`
- `dashboardSummary`
- `recentTasks`
- `upcomingRecurringRuns`
- `agentRosterDisplay`

## 6.3 View-mode contract
- Board and List render the same filtered task universe.
- View toggle updates presentation only, not data identity.
- If no results, both views show the same semantic empty state with mode-specific layout.

## 6.4 Search contract
- Search must match at least task title and can later expand to agent/document indices.
- In this phase, the UI should expose a single global search field but search implementation may initially target task titles and selected visible metadata only.
- Placeholder or helper text may communicate future scope if desired.

## 6.5 Filter contract
- Agent filter applies to task assignee.
- Priority filter applies to task priority.
- Tag filter applies as OR-within-selected-tags and AND-across-other-filters unless product later changes this rule.
- Active filters should be visibly represented in the UI.

---

## 7. Mock adapter and frontend data contract

## 7.1 Adapter boundary
Developer should implement a frontend repository interface like:

```ts
interface WorkflowViewRepository {
  getTasksView(): Promise<TasksViewPayload>;
  getDashboardView(): Promise<DashboardViewPayload>;
  runRecurringTaskNow(taskId: string): Promise<UIActionResult>;
  pauseRecurringTask(taskId: string): Promise<UIActionResult>;
  updateTaskStatus(input: TaskStatusTransitionInput): Promise<UIActionResult>;
}
```

The implementation in this phase is mock-only.

## 7.2 Raw entity shape (frontend-facing, mock-backed)
```ts
interface TaskEntity {
  id: string;
  title: string;
  brief?: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeAgentId: string | null;
  tagIds: string[];
  timeTrackingLabel: string;
  startedAt?: string | null;
  completedAt?: string | null;
  recurringTemplateId?: string | null;
}

interface RecurringTaskEntity {
  id: string;
  title: string;
  scheduleLabel: string;
  startsAt: string;
  nextRunAt: string;
  status: 'active' | 'paused';
  defaultAgentId?: string | null;
}

interface AgentEntity {
  id: string;
  displayName: string;
  roleLabel: 'General' | 'Coder' | 'Analyst' | 'Writer';
  presence: 'online' | 'offline';
  avatarSeed?: string;
}
```

## 7.3 Route payloads
```ts
interface TasksViewPayload {
  tasks: TaskEntity[];
  recurringTasks: RecurringTaskEntity[];
  agents: AgentEntity[];
  availableTags: Array<{ id: string; label: string }>;
  systemStatus: {
    server: 'ready' | 'degraded' | 'offline';
    label: string;
  };
  userProfile: {
    displayName: string;
    plan: string;
    email: string;
  };
}

interface DashboardViewPayload {
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
```

## 7.4 UI action result contract
```ts
interface UIActionResult {
  ok: boolean;
  message?: string;
}
```

No backend semantics such as validation codes, retry metadata, or audit fields are required in this phase.

---

## 8. Presentation model and UI transitions

## 8.1 Task presentation model
Each task card/row should render from a derived presentation model:
- title
- short brief (optional)
- status chip
- priority chip
- assignee display
- tag chips
- time label
- drag eligibility
- detail entry affordance

## 8.2 Allowed UI transitions in this phase
At the view layer, allow:
- `todo -> in_progress`
- `in_progress -> blocked`
- `in_progress -> in_review`
- `blocked -> todo`
- `blocked -> in_progress`
- `in_review -> in_progress`
- `in_review -> done`
- `done -> todo` only if product wants visible mock reset behavior for demos; otherwise omit from UI

### Rule
These are **UI transitions only** for local/mock behavior. They must be encapsulated in a transition helper, not hardcoded throughout components.

## 8.3 Waiting presentation contract
- Waiting renders as one column/region with two visible child sections:
  - Blocked
  - In Review
- Each child section should have its own empty state.
- Color coding can distinguish the groups, but must remain accessible in both light/dark mode.

## 8.4 Done presentation contract
- Done tasks must be bucketed by completed date label.
- Each bucket is collapsible.
- Buckets sort descending by date.
- Empty Done state must still show the column shell for drag target consistency if drag/drop exists.

---

## 9. Recurring-task presentation contract

Each recurring item must display:
- title
- `FIXED SCHEDULE` badge
- state badge (`ACTIVE` / `PAUSED`)
- starts label
- next-run label
- action affordances: Edit, Pause/Resume, Force Run, Refresh

### UI behavior in this phase
- Edit opens mock-ready detail/edit entry, not a full backend-backed form system.
- Pause/Resume updates local mock state and badge rendering.
- Force Run creates or simulates an immediate task run in the visible task dataset through the adapter layer.
- Refresh re-reads from the adapter layer and can simulate updated timestamps.

### Deferred
- Cron syntax editing
- Execution guarantees
- Retry policies
- Server-side scheduler state

---

## 10. Agent presence and time-tracking display contracts

## 10.1 Agent roster contract
Sidebar roster item must show:
- avatar or initials
- display name
- role label
- presence dot/state

### Rules
- Presence is display-only in this phase.
- Offline agents remain visible.
- Assignment UI may allow displaying offline agents, but any restriction logic belongs to later phases.

## 10.2 Time-tracking contract
- UI consumes a preformatted label such as `less than a minute`, `1 minute`, `19 minutes`.
- Do not implement running timer engines in this phase unless purely cosmetic and isolated.
- Time labels should be readable in both board and list views.

---

## 11. Responsive, theming, and i18n guidance

## 11.1 Responsive behavior
### Desktop
- Persistent sidebar
- Four-column board possible
- Recurring strip visible above board

### Tablet
- Sidebar may collapse into compact rail/drawer
- Board may horizontally scroll or convert to denser stacked columns
- Done accordion remains grouped

### Mobile
- Sidebar becomes drawer
- Filters may collapse into sheet/popover
- Default to List view if board becomes too dense, while still preserving board availability if product chooses
- Recurring section should become horizontally stacked cards or vertical compact list

## 11.2 Design-system guidance
The brief specifies:
- modern UI
- pastel palette
- soft radius
- clear hierarchy
- dark/light support
- multilingual readiness

### Recommended token groups
- surface/background tiers
- subtle pastel accents by status/section
- radius scale leaning soft/rounded
- readable neutral typography scale
- shadow tokens for card lift without harsh depth
- light/dark semantic tokens

### Guardrails
- Do not mix pastel softness with overcrowded dense cards.
- Board columns need clear headers and spacious separation.
- Status colors must remain distinguishable in dark mode.
- Sidebar sections should be visually grouped but not heavy.

## 11.3 Multilingual-ready guidance
- Avoid fixed-width assumptions in chips/buttons.
- Action labels should tolerate longer English/Vietnamese strings.
- Date/time labels should come from formatting helpers, not hardcoded component strings.

---

## 12. Phase split: build now vs defer later

## 12.1 Build now (current phase)
- Tasks page shell and layout
- Dashboard summary surface
- Board/List toggle and shared filter/search state
- Agent roster and system status display
- Recurring tasks display and mock actions
- Task cards/list rows
- Waiting sub-groups
- Done accordion groups
- Theme/dark-light-ready component styling
- Locale-aware string plumbing
- Mock repository and deterministic derived selectors
- Local/mock transitions and loading/error states

## 12.2 Defer to later backend/service phase
- Real persistence and task mutation APIs
- Agent execution pipeline
- Prompt/workflow routing
- Presence from real service heartbeats
- Real scheduler/cron engine
- Accurate live time tracking
- Search across documents/agents via service index
- Notification/event streams
- Multi-user collaboration and permission rules

### Strict downstream guardrail
Developer must not implement fake backend abstractions that look production-final. Anything beyond the mock adapter boundary should be clearly marked future-phase.

---

## 13. Recommended frontend stack direction

Recommended direction for this phase:
- **Next.js + TypeScript** for route structure and app shell
- **Tailwind CSS** (or existing design-token-friendly utility layer) for rapid themed surfaces
- **shadcn/ui or internal primitive layer** for accessible base controls if aligned with current repo
- **TanStack Query** only if the app already uses it or if mock async patterns should mirror future fetch boundaries; otherwise a simple loader/repository hook is enough
- **TanStack Table** only if List view needs richer table behavior immediately; otherwise a simpler responsive list/table is acceptable for P0
- **DnD library** only if drag/drop is actually implemented in this slice; choose a lightweight maintained option and keep transition logic isolated

### Recommendation nuance
Because this is view-first, choose the simplest stack that supports deterministic UI and future replacement. Avoid adding heavy state machinery unless current repo complexity justifies it.

---

## 14. Developer handoff summary

The developer should implement:
1. App shell and route scaffolding for `/tasks` and `/dashboard`
2. Mock repository plus fixtures aligned to the contracts above
3. Shared state container for search/filter/view/presentation state
4. Tasks-first UI with recurring strip, board/list, waiting split, done accordion
5. Dashboard summary widgets backed by the same derived models
6. Theme/i18n-ready layout primitives
7. Empty/loading/error placeholders

### Non-goals for developer in this phase
- real backend calls
- real cron logic
- production search
- true agent execution lifecycle
- complicated permissions/auth work

### Validation expectation
Developer-side validation should focus on:
- rendering correctness
- state persistence across view toggles
- filter/search behavior
- drag/drop or state transition helpers if implemented
- responsive behavior of key surfaces
