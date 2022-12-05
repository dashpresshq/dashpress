import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { BaseIntegrationsConfiguration } from "frontend/views/settings/Configurations/Base";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { Spacer } from "@hadmean/chromista";
import { BaseActionsLayout } from "../_Base";
import { ACTIONS_VIEW_KEY } from "../constants";

export function ManageVariables() {
  useSetPageDetails({
    pageTitle: "Manage Variables",
    viewKey: ACTIONS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
  });

  return (
    <BaseActionsLayout>
      <BaseIntegrationsConfiguration
        group={IntegrationsConfigurationGroup.Constants}
      />
      <Spacer />
      {/*  */}
      {/* CAN_MANAGE_INTEGRATIONS will be able to reveal, update, and delete */}
      <BaseIntegrationsConfiguration
        group={IntegrationsConfigurationGroup.Credentials}
      />
    </BaseActionsLayout>
  );
}
