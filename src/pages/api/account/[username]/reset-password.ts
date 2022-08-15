import { usersController } from "backend/users/users.controller";
import { RESET_PASSWORD_FORM_SCHEMA } from "shared/form-schemas/users/reset-password";
import { USER_PERMISSIONS } from "shared/types";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: RESET_PASSWORD_FORM_SCHEMA,
        },
        {
          _type: "requestQuery",
          options: "username",
        },
      ]);
      return await usersController.resetPassword(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_RESET_PASSWORD,
    },
  ]
);
