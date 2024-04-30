import { RESET_PASSWORD_FORM_SCHEMA } from "shared/form-schemas/users/reset-password";
import { UserPermissions } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { usersApiService } from "backend/users/users.service";

export default requestHandler(
  {
    PATCH: async (getValidatedRequest) => {
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
      return await usersApiService.resetPassword(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "notAllowedOnDemo",
    },
    {
      _type: "canUser",
      body: UserPermissions.CAN_RESET_PASSWORD,
    },
  ]
);
