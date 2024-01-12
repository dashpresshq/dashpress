import { USER_PERMISSIONS } from "shared/constants/user";
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
      body: USER_PERMISSIONS.CAN_MANAGE_APP_CREDENTIALS,
    },
    {
      _type: "withPassword",
    },
  ]
);
