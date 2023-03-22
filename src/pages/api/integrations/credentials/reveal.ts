import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { integrationsConfigurationController } from "backend/integrations-configurations/integrations-configurations.controller";

export default requestHandler(
  {
    POST: async () => {
      return await integrationsConfigurationController.listWithRevealedValues();
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
    {
      _type: "withPassword",
    },
  ]
);
