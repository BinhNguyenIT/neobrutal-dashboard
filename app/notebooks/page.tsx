"use client";

import { PlaceholderPage } from "@/components/workflow/placeholder-page";
import { copy } from "@/lib/workflow/i18n";
import { useWorkflow } from "@/components/workflow/workflow-provider";

export default function NotebooksRoute() {
  const { viewState } = useWorkflow();
  const strings = copy[viewState.locale];

  return <PlaceholderPage section={strings.notebooks} description={strings.placeholderNotebooksDescription} />;
}
