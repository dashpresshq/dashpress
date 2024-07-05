import { requestHandler } from "backend/lib/request";
import { integrationsConfigurationApiController } from "backend/integrations-configurations/integrations-configurations.controller";
import type { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { UserPermissions } from "shared/constants/user";

export const integrationsConfigurationListRequestHandler = (
  group: IntegrationsConfigurationGroup
) => {
  return requestHandler(
    {
      GET: async () => {
        return await integrationsConfigurationApiController.list(group);
      },
    },
    [
      {
        _type: "canUser",
        body: UserPermissions.CAN_CONFIGURE_APP,
      },
    ]
  );
};
