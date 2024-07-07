import { integrationsApiService } from "@/backend/integrations/integrations.service";
import { requestHandler } from "@/backend/lib/request";

const REQUEST_KEY_FIELD = "key";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      {
        _type: "requestQuery",
        options: REQUEST_KEY_FIELD,
      },
    ]);

    return integrationsApiService.listIntegrationImplementations(
      validatedRequest.requestQuery
    );
  },
});
