import { SectionBox } from "@hadmean/chromista";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { BaseActionInstances } from "./Base";

export function EntityFormActionsSettings() {
  const entity = useEntitySlug();

  useSetPageDetails({
    pageTitle: "Form Integrations",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title="Form Integrations"
        iconButtons={[
          {
            action: NAVIGATION_LINKS.SETTINGS.VARIABLES,
            icon: "settings",
            label: "Manage Variables",
          },
          {
            action: LINK_TO_DOCS(`integrations/form`),
            icon: "help",
            label: "Form Integrations Documentation",
          },
        ]}
      >
        <BaseActionInstances entity={entity} />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
