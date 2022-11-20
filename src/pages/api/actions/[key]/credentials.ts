import { IAccountProfile, USER_PERMISSIONS } from "shared/types/user";
import { actionsController } from "backend/actions/actions.controller";
import { requestHandler } from "backend/lib/request";

const REQUEST_KEY_FIELD = "key";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
        {
          _type: "requestBody",
          options: {},
        },
        "authenticatedUser",
      ]);

      return await actionsController.showActionConfig(
        validatedRequest.requestQuery,
        {
          password: validatedRequest.requestBody.password,
          username: (validatedRequest.authenticatedUser as IAccountProfile)
            .username,
        }
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_ACTIONS,
    },
  ]
);
