"use client";

import { PlaceholderPage } from "@/components/workflow/placeholder-page";
import { copy } from "@/lib/workflow/i18n";
import { useWorkflow } from "@/components/workflow/workflow-provider";

export default function SettingsRoute() {
  const { viewState } = useWorkflow();
  const strings = copy[viewState.locale];

  return <PlaceholderPage section={strings.settings} description={strings.placeholderSettingsDescription} />;
}
