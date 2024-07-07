import { integrationsConfigurationApiController } from "@/backend/integrations-configurations/integrations-configurations.controller";
import { requestHandler } from "@/backend/lib/request";
import { UserPermissions } from "@/shared/constants/user";
import type { IntegrationsConfigurationGroup } from "@/shared/types/integrations";

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
