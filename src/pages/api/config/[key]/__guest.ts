import { configurationApiController } from "../../../../backend/configuration/configuration.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest(["configKey"]);

      return await configurationApiController.showGuestConfig(
        validatedRequest.configKey
      );
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
