import { configurationController } from "../../../../backend/configuration/configuration.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "configKey",
        "entity",
      ]);
      return await configurationController.showConfig(
        validatedRequest.configKey,
        validatedRequest.entity
      );
    },
    PUT: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "configKey",
        "entity",
        "configBody",
      ]);
      return await configurationController.upsertConfig(
        validatedRequest.configKey,
        validatedRequest.configBody,
        validatedRequest.entity
      );
    },
  },
  [
    {
      _type: "isCreator",
      method: ["PUT"],
    },
  ]
);
