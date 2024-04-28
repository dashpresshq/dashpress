import { UserPermissions } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { integrationsConfigurationApiController } from "backend/integrations-configurations/integrations-configurations.controller";

export default requestHandler(
  {
    POST: async () => {
      return await integrationsConfigurationApiController.listWithRevealedValues();
    },
  },
  [
    {
      _type: "canUser",
      body: UserPermissions.CAN_MANAGE_APP_CREDENTIALS,
    },
    {
      _type: "withPassword",
    },
  ]
);
