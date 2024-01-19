import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { formActionsApiService } from "backend/form-actions/form-actions.service";

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
      body: USER_PERMISSIONS.CAN_CONFIGURE_APP,
    },
  ]
);
