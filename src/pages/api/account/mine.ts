import { usersApiController } from "backend/users/users.controller";
import { UPDATE_PROFILE_FORM_SCHEMA } from "shared/form-schemas/profile/update";
import { IAccountProfile } from "shared/types/user";
import { requestHandler } from "backend/lib/request";

export default requestHandler({
  PATCH: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestBody",
        options: UPDATE_PROFILE_FORM_SCHEMA,
      },
    ]);
    return await usersApiController.updateProfile(
      (validatedRequest.authenticatedUser as IAccountProfile).username,
      validatedRequest.requestBody
    );
  },
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["authenticatedUser"]);
    return await usersApiController.getAuthenticatedUserBag(
      (validatedRequest.authenticatedUser as IAccountProfile).username
    );
  },
});
