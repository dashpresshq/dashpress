import { configurationApiController } from "@/backend/configuration/configuration.controller";
import { requestHandler } from "@/backend/lib/request";

const REQUEST_QUERY_FIELD = "key";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
      ]);

      return await configurationApiController.showGuestConfig(
        validatedRequest.requestQuery
      );
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
