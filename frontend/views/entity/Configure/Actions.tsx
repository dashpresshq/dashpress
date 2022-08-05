import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useSetPageTitle } from "frontend/lib/routing";
import { ENTITY_CONFIGURATION_VIEW } from "./constants";
import { BaseEntitySettingsLayout } from "./_Base";

export function EntityActionsSettings() {
  useSetPageTitle("Actions Settings", ENTITY_CONFIGURATION_VIEW);
  return (
    <BaseEntitySettingsLayout>
      <SectionBox title="Actions Settings">
        <ErrorAlert message="error" />
        TODO
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
