import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { ENTITY_CONFIGURATION_VIEW } from "./constants";
import { BaseEntitySettingsLayout } from "./_Base";

export function EntityActionsSettings() {
  useSetPageDetails({
    pageTitle: "Actions Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseEntitySettingsLayout>
      <SectionBox title="Actions Settings">
        <ErrorAlert message="error" />
        TODO
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
