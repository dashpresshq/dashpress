import { requestHandler } from "backend/lib/request";
import { usersApiController } from "backend/users/users.controller";
import { usersApiService } from "backend/users/users.service";
import { UPDATE_PROFILE_FORM_SCHEMA } from "shared/form-schemas/profile/update";
import type { IAccountProfile } from "shared/types/user";

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
