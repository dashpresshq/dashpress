import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useSetPageTitle } from "frontend/lib/routing/useGoBackContext";
import { BaseEntitySettingsLayout } from "./_Base";

export function EntityActionsSettings() {
  useSetPageTitle("Actions Settings");
  return (
    <BaseEntitySettingsLayout>
      <SectionBox title="Actions Settings">
        <ErrorAlert message="error" />
        TODO
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
