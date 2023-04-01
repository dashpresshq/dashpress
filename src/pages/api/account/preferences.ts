import { usersApiController } from "backend/users/users.controller";
import { UPDATE_USER_PREFERENCES_FORM_SCHEMA } from "shared/form-schemas/profile/update";
import { IAccountProfile } from "shared/types/user";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  PATCH: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestBody",
        options: UPDATE_USER_PREFERENCES_FORM_SCHEMA,
      },
    ]);
    return await usersApiController.updateUserPreferences(
      (validatedRequest.authenticatedUser as IAccountProfile).username,
      validatedRequest.requestBody
    );
  },
});
