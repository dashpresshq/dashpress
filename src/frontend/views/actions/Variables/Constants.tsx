import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { BaseIntegrationsConfiguration } from "frontend/views/settings/Configurations/Base";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { BaseActionsLayout } from "../_Base";
import { ACTIONS_VIEW_KEY } from "../constants";

export function ManageConstants() {
  useSetPageDetails({
    pageTitle: "Manage Constants",
    viewKey: ACTIONS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseActionsLayout>
      <BaseIntegrationsConfiguration
        group={IntegrationsConfigurationGroup.Constants}
      />
    </BaseActionsLayout>
  );
}
