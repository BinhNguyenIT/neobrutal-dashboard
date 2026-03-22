import { ReactNode } from "react";

export function DashboardShell({
  header,
  filters,
  children,
}: {
  header: ReactNode;
  filters: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[30px] border-4 border-line bg-bg/80 p-3 shadow-brutal backdrop-blur sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          {header}
          {filters}
        </div>
      </div>
      <main className="mt-6 flex-1">{children}</main>
    </div>
  );
}
