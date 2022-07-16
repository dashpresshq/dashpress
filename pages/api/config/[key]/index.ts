import { configurationController } from "../../../../backend/configuration/configuration.controller";
import { requestHandler } from "../../../../backend/lib/request";

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
      _type: "isDeveloper",
      method: ["PUT"],
    },
  ]
);
