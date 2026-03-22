"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

import { copy } from "@/lib/workflow/i18n";
import { useWorkflow } from "@/components/workflow/workflow-provider";

function SidebarNavLink({
  href,
  label,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center rounded-[18px] border px-4 py-3 text-sm font-medium transition",
        active
          ? "border-[var(--accent)] bg-[color:var(--surface-contrast)] text-[var(--accent-strong)]"
          : "border-transparent text-muted hover:border-[var(--line)] hover:bg-[color:var(--surface)] hover:text-[var(--text)]",
        collapsed && "justify-center px-3",
      )}
    >
      {collapsed ? label.slice(0, 1) : label}
    </Link>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="glass-panel rounded-[24px] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-soft">{title}</p>
      {children}
    </section>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { payload, derived, viewState, toggleSidebar, setSearchQuery, setAgentFilter, setPriorityFilter, toggleTagFilter, setViewMode, setThemeMode, setLocale, openCreateTask } =
    useWorkflow();
  const strings = copy[viewState.locale];

  const navItems = [
    { href: "/tasks", label: strings.tasks },
    { href: "/dashboard", label: strings.dashboard },
    { href: "/agents", label: strings.agents },
    { href: "/notebooks", label: strings.notebooks },
    { href: "/documents", label: strings.documents },
    { href: "/settings", label: strings.settings },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1560px] gap-4">
        <aside
          className={clsx(
            "glass-panel-strong hidden shrink-0 rounded-[30px] p-4 md:flex md:flex-col md:gap-4",
            viewState.sidebarCollapsed ? "md:w-[92px]" : "md:w-[308px]",
          )}
        >
          <div className="flex items-center justify-between gap-3 rounded-[24px] bg-[color:var(--surface-contrast)] px-4 py-4">
            <div className={clsx("transition", viewState.sidebarCollapsed && "hidden")}>
              <p className="text-xs uppercase tracking-[0.24em] text-soft">{strings.summary}</p>
              <h1 className="text-lg">{strings.appName}</h1>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-full border border-[var(--line)] bg-[color:var(--surface)] px-3 py-2 text-sm text-muted transition hover:text-[var(--text)]"
              aria-label={strings.toggleSidebar}
            >
              {viewState.sidebarCollapsed ? ">" : "<"}
            </button>
          </div>

          <nav className="grid gap-2">
            {navItems.map((item) => (
              <SidebarNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={pathname.startsWith(item.href)}
                collapsed={viewState.sidebarCollapsed}
              />
            ))}
          </nav>

          {!viewState.sidebarCollapsed && (
            <>
              <SidebarSection title={strings.roster}>
                <div className="space-y-3">
                  {derived?.agentRosterDisplay.map((agent) => (
                    <div key={agent.id} className="flex items-center gap-3 rounded-[18px] bg-[color:var(--surface)] px-3 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-contrast)] text-sm font-semibold">
                        {agent.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{agent.displayName}</p>
                        <p className="text-xs text-muted">
                          {agent.roleLabel} · {agent.activeTaskCount} {strings.open}
                        </p>
                      </div>
                      <span
                        className={clsx(
                          "h-3 w-3 rounded-full",
                          agent.presence === "online" ? "bg-[color:var(--success)]" : "bg-[color:var(--text-soft)]",
                        )}
                      />
                    </div>
                  ))}
                </div>
              </SidebarSection>

              <SidebarSection title={strings.systemStatus}>
                <p className="text-sm font-medium">{payload?.systemStatus.label}</p>
                <p className="mt-2 text-xs text-muted">{strings.serverState}: {payload?.systemStatus.server ?? strings.loading}</p>
              </SidebarSection>

              <SidebarSection title={strings.account}>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{payload?.userProfile.displayName}</p>
                  <p className="text-sm text-muted">{payload?.userProfile.plan}</p>
                  <p className="text-xs text-soft">{payload?.userProfile.email}</p>
                </div>
              </SidebarSection>
            </>
          )}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="glass-panel-strong rounded-[30px] px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
                  <label className="glass-panel flex items-center gap-3 rounded-[20px] px-4 py-3">
                    <span className="text-soft">/</span>
                    <input
                      aria-label="Search tasks"
                      value={viewState.searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={strings.searchPlaceholder}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-soft"
                    />
                  </label>

                  <select
                    aria-label="Agent filter"
                    value={viewState.filters.agentId}
                    onChange={(event) => setAgentFilter(event.target.value)}
                    className="glass-panel rounded-[20px] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">{strings.allAgents}</option>
                    {payload?.agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.displayName}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Priority filter"
                    value={viewState.filters.priority}
                    onChange={(event) => setPriorityFilter(event.target.value as typeof viewState.filters.priority)}
                    className="glass-panel rounded-[20px] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">{strings.allPriorities}</option>
                    <option value="low">{strings.low}</option>
                    <option value="medium">{strings.medium}</option>
                    <option value="high">{strings.high}</option>
                    <option value="urgent">{strings.urgent}</option>
                  </select>

                  <div className="glass-panel flex items-center gap-2 rounded-[20px] px-3 py-2">
                    {(payload?.availableTags ?? []).slice(0, 3).map((tag) => {
                      const active = viewState.filters.tagIds.includes(tag.id);

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTagFilter(tag.id)}
                          className={clsx(
                            "rounded-full px-3 py-2 text-xs transition",
                            active
                              ? "bg-[color:var(--accent)] text-white"
                              : "bg-[color:var(--surface-contrast)] text-muted hover:text-[var(--text)]",
                          )}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode("board")}
                      className={clsx(
                        "rounded-[20px] px-4 py-3 text-sm transition",
                        viewState.viewMode === "board"
                          ? "bg-[color:var(--accent)] text-white"
                          : "glass-panel text-muted hover:text-[var(--text)]",
                      )}
                    >
                      {strings.board}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={clsx(
                        "rounded-[20px] px-4 py-3 text-sm transition",
                        viewState.viewMode === "list"
                          ? "bg-[color:var(--accent)] text-white"
                          : "glass-panel text-muted hover:text-[var(--text)]",
                      )}
                    >
                      {strings.list}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Theme mode"
                    value={viewState.themeMode}
                    onChange={(event) => setThemeMode(event.target.value as typeof viewState.themeMode)}
                    className="glass-panel rounded-[20px] px-4 py-3 text-sm outline-none"
                  >
                    <option value="system">{strings.theme}: {strings.system}</option>
                    <option value="light">{strings.theme}: {strings.light}</option>
                    <option value="dark">{strings.theme}: {strings.dark}</option>
                  </select>

                  <select
                    aria-label="Locale"
                    value={viewState.locale}
                    onChange={(event) => setLocale(event.target.value as typeof viewState.locale)}
                    className="glass-panel rounded-[20px] px-4 py-3 text-sm outline-none"
                  >
                    <option value="en">{strings.english}</option>
                    <option value="vi">{strings.vietnamese}</option>
                  </select>

                  <button
                    type="button"
                    onClick={openCreateTask}
                    className="rounded-[20px] bg-[color:var(--accent-strong)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    {strings.newTask}
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
