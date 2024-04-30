import { usersApiController } from "backend/users/users.controller";
import { UPDATE_PROFILE_FORM_SCHEMA } from "shared/form-schemas/profile/update";
import { IAccountProfile } from "shared/types/user";
import { requestHandler } from "backend/lib/request";
import { usersApiService } from "backend/users/users.service";

export default requestHandler({
  PATCH: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestBody",
        options: UPDATE_PROFILE_FORM_SCHEMA,
      },
    ]);
    return await usersApiService.updateUser(
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
