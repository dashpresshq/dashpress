import { USER_PERMISSIONS } from "shared/constants/user";
import { configurationApiController } from "../../../../backend/configuration/configuration.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "configKey",
        {
          _type: "entity",
          options: true,
        },
      ]);
      return await configurationApiController.showConfig(
        validatedRequest.configKey,
        validatedRequest.entity
      );
    },
    PUT: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "configKey",
        {
          _type: "entity",
          options: true,
        },
        "configBody",
      ]);
      return await configurationApiController.upsertConfig(
        validatedRequest.configKey,
        validatedRequest.configBody,
        validatedRequest.entity
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
