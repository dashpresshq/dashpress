import { CHANGE_PASSWORD_FORM_SCHEMA } from "shared/form-schemas/profile/password";
import { IAccountProfile } from "shared/types/user";
import { requestHandler } from "backend/lib/request";
import { usersApiService } from "backend/users/users.service";

export default requestHandler(
  {
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "authenticatedUser",
        {
          _type: "requestBody",
          options: CHANGE_PASSWORD_FORM_SCHEMA,
        },
      ]);
      return await usersApiService.changePassword(
        (validatedRequest.authenticatedUser as IAccountProfile).username,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "notAllowedOnDemo",
    },
  ]
);
