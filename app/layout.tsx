import type { Metadata } from "next";
import { ReactNode } from "react";

import { QueryProvider } from "@/components/providers/query-provider";
import { AppShell } from "@/components/workflow/app-shell";
import { WorkflowProvider } from "@/components/workflow/workflow-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI Workflow Kanban",
  description: "View-first AI workflow kanban system built with frontend-only mock adapters.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <WorkflowProvider>
            <AppShell>{children}</AppShell>
          </WorkflowProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
