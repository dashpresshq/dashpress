import { requestHandler } from "backend/lib/request";
import { userPreferenceApiController } from "backend/user-preferences/user-preferences.controller";
import { IAccountProfile } from "shared/types/user";

const REQUEST_QUERY_FIELD = "key";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestQuery",
        options: REQUEST_QUERY_FIELD,
      },
    ]);
    return await userPreferenceApiController.show(
      (validatedRequest.authenticatedUser as IAccountProfile).username,
      validatedRequest.requestQuery
    );
  },
  PUT: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestQuery",
        options: REQUEST_QUERY_FIELD,
      },
      {
        _type: "requestBody",
        options: {},
      },
    ]);
    return await userPreferenceApiController.upsert(
      (validatedRequest.authenticatedUser as IAccountProfile).username,
      validatedRequest.requestQuery,
      validatedRequest.requestBody.data
    );
  },
});
