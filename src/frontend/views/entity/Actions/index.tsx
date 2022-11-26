import { SectionBox } from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { BaseActionInstances } from "./Base";

export function EntityFormActionsSettings() {
  const entity = useEntitySlug();

  useSetPageDetails({
    pageTitle: "Form Actions",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title="Form Actions"
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/TODO"),
            icon: "help",
            label: "Form Actions Documentation",
          },
        ]}
      >
        <BaseActionInstances entity={entity} />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
