import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { BaseIntegrationsConfiguration } from "frontend/views/settings/Configurations/Base";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { BaseActionsLayout } from "../_Base";
import { ACTIONS_VIEW_KEY } from "../constants";

export function ManageCredentials() {
  useSetPageDetails({
    pageTitle: "Manage Credentials",
    viewKey: ACTIONS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_MANAGE_ACTIONS, // :eyes
  });

  return (
    <BaseActionsLayout>
      <BaseIntegrationsConfiguration
        group={IntegrationsConfigurationGroup.Credentials}
      />
    </BaseActionsLayout>
  );
}
