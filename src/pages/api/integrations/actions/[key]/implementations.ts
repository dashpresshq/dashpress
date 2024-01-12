import { actionsApiService } from "backend/actions/actions.service";
import { requestHandler } from "backend/lib/request";

const REQUEST_KEY_FIELD = "key";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      {
        _type: "requestQuery",
        options: REQUEST_KEY_FIELD,
      },
    ]);

    return actionsApiService.listIntegrationImplementations(
      validatedRequest.requestQuery
    );
  },
});
