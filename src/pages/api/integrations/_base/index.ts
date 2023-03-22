import { requestHandler } from "backend/lib/request";
import { integrationsConfigurationController } from "backend/integrations-configurations/integrations-configurations.controller";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { USER_PERMISSIONS } from "shared/constants/user";

export const integrationsConfigurationListRequestHandler = (
  group: IntegrationsConfigurationGroup
) => {
  return requestHandler(
    {
      GET: async () => {
        return await integrationsConfigurationController.list(group);
      },
    },
    [
      {
        _type: "canUser",
        body: USER_PERMISSIONS.CAN_CONFIGURE_APP,
      },
    ]
  );
};
