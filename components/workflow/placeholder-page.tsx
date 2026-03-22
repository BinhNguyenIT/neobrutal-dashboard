"use client";

import { copy } from "@/lib/workflow/i18n";
import { useWorkflow } from "@/components/workflow/workflow-provider";

export function PlaceholderPage({ section, description }: { section: string; description: string }) {
  const { viewState } = useWorkflow();
  const strings = copy[viewState.locale];

  return (
    <div className="glass-panel-strong rounded-[30px] p-6">
      <p className="text-xs uppercase tracking-[0.24em] text-soft">{strings.placeholder}</p>
      <h1 className="mt-2 text-3xl">{section}</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">{description}</p>
    </div>
  );
}
