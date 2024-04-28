import { UserPermissions } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { formActionsApiService } from "backend/form-actions/form-actions.service";

const REQUEST_KEY_FIELD = "key";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
      ]);

      return await formActionsApiService.listEntityFormActions(
        validatedRequest.requestQuery
      );
    },
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
        {
          _type: "requestBody",
          options: {},
        },
      ]);

      return await formActionsApiService.updateFormAction(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
      ]);

      return await formActionsApiService.deleteFormAction(
        validatedRequest.requestQuery
      );
    },
  },
  [
    {
      _type: "canUser",
      body: UserPermissions.CAN_CONFIGURE_APP,
    },
  ]
);
