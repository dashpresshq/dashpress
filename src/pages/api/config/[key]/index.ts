import { USER_PERMISSIONS } from "shared/types/user";
import { configurationController } from "backend/configuration/configuration.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest(["configKey"]);

      return await configurationController.showConfig(
        validatedRequest.configKey
      );
    },
    PUT: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "configKey",
        "configBody",
      ]);

      return await configurationController.upsertConfig(
        validatedRequest.configKey,
        validatedRequest.configBody
      );
    },
  },
  [
    {
      method: ["PUT"],
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_CONFIGURE_APP,
    },
  ]
);
