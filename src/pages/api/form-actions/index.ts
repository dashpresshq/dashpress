import { formActionsApiService } from "backend/form-actions/form-actions.service";
import { requestHandler } from "backend/lib/request";
import { UserPermissions } from "shared/constants/user";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: {},
        },
      ]);

      return await formActionsApiService.createFormAction(
        validatedRequest.requestBody
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
