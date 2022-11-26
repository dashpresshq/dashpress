import { USER_PERMISSIONS } from "shared/types/user";
import { actionsController } from "backend/actions/actions.controller";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: {},
        },
      ]);

      return await actionsController.instantiateAction(
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
