import { IAccountProfile, USER_PERMISSIONS } from "shared/types/user";
import { requestHandler } from "backend/lib/request";
import { integrationsConfigurationController } from "backend/integrations-configurations/integrations-configurations.controller";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: {},
        },
        "authenticatedUser",
      ]);

      return await integrationsConfigurationController.listWithRevealedValues({
        password: validatedRequest.requestBody.password,
        username: (validatedRequest.authenticatedUser as IAccountProfile)
          .username,
      });
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
  ]
);
