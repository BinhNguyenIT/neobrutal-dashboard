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
        "neo-focus flex items-center rounded-[10px] border-[2px] px-4 py-3 text-sm font-bold transition",
        active
          ? "border-[var(--line-strong)] bg-[color:var(--accent)] text-white shadow-[4px_4px_0_0_var(--line-strong)]"
          : "border-[var(--line)] bg-[color:var(--surface)] text-muted shadow-[4px_4px_0_0_var(--line)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:text-[var(--text)]",
        collapsed && "justify-center px-3",
      )}
    >
      {collapsed ? label.slice(0, 1) : label}
    </Link>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="neo-card p-4">
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
            "glass-panel-strong hidden shrink-0 p-4 md:flex md:flex-col md:gap-4",
            viewState.sidebarCollapsed ? "md:w-[92px]" : "md:w-[308px]",
          )}
        >
          <div className="neo-inset flex items-center justify-between gap-3 px-4 py-4">
            <div className={clsx("transition", viewState.sidebarCollapsed && "hidden")}>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">{strings.summary}</p>
              <h1 className="text-lg">{strings.appName}</h1>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="neo-button neo-focus min-w-10 px-3 py-2 text-sm text-muted"
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
                    <div key={agent.id} className="neo-inset flex items-center gap-3 px-3 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border-[2px] border-[var(--line)] bg-[color:var(--surface-raised)] text-sm font-extrabold">
                        {agent.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{agent.displayName}</p>
                        <p className="text-xs text-[color:var(--text-muted)]">
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
                <p className="mt-2 text-xs text-[color:var(--text-muted)]">{strings.serverState}: {payload?.systemStatus.server ?? strings.loading}</p>
              </SidebarSection>

              <SidebarSection title={strings.account}>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{payload?.userProfile.displayName}</p>
                  <p className="text-sm text-[color:var(--text-muted)]">{payload?.userProfile.plan}</p>
                  <p className="text-xs text-muted">{payload?.userProfile.email}</p>
                </div>
              </SidebarSection>
            </>
          )}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="glass-panel-strong px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
                  <label className="neo-card neo-focus flex items-center gap-3 px-4 py-3">
                    <span className="text-muted">/</span>
                    <input
                      aria-label="Search tasks"
                      value={viewState.searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={strings.searchPlaceholder}
                      className="w-full bg-transparent text-sm text-[color:var(--text)] outline-none placeholder:text-muted"
                    />
                  </label>

                  <select
                    aria-label="Agent filter"
                    value={viewState.filters.agentId}
                    onChange={(event) => setAgentFilter(event.target.value)}
                    className="neo-card neo-focus px-4 py-3 text-sm text-[color:var(--text)] outline-none"
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
                    className="neo-card neo-focus px-4 py-3 text-sm text-[color:var(--text)] outline-none"
                  >
                    <option value="all">{strings.allPriorities}</option>
                    <option value="low">{strings.low}</option>
                    <option value="medium">{strings.medium}</option>
                    <option value="high">{strings.high}</option>
                    <option value="urgent">{strings.urgent}</option>
                  </select>

                  <div className="neo-card flex items-center gap-2 px-3 py-2">
                    {(payload?.availableTags ?? []).slice(0, 3).map((tag) => {
                      const active = viewState.filters.tagIds.includes(tag.id);

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTagFilter(tag.id)}
                          className={clsx(
                            "neo-focus px-3 py-2 text-xs transition",
                            active
                              ? "neo-chip-active"
                              : "neo-chip hover:text-[var(--text)]",
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
                        "neo-focus px-4 py-3 text-sm transition",
                        viewState.viewMode === "board"
                          ? "neo-button neo-button-primary"
                          : "neo-button text-muted",
                      )}
                    >
                      {strings.board}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={clsx(
                        "neo-focus px-4 py-3 text-sm transition",
                        viewState.viewMode === "list"
                          ? "neo-button neo-button-primary"
                          : "neo-button text-muted",
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
                    className="neo-card neo-focus px-4 py-3 text-sm text-[color:var(--text)] outline-none"
                  >
                    <option value="system">{strings.theme}: {strings.system}</option>
                    <option value="light">{strings.theme}: {strings.light}</option>
                    <option value="dark">{strings.theme}: {strings.dark}</option>
                  </select>

                  <select
                    aria-label="Locale"
                    value={viewState.locale}
                    onChange={(event) => setLocale(event.target.value as typeof viewState.locale)}
                    className="neo-card neo-focus px-4 py-3 text-sm text-[color:var(--text)] outline-none"
                  >
                    <option value="en">{strings.english}</option>
                    <option value="vi">{strings.vietnamese}</option>
                  </select>

                  <button
                    type="button"
                    onClick={openCreateTask}
                    className="neo-button neo-button-primary neo-focus px-5 py-3 text-sm"
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
