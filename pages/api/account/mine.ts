import { usersController } from "backend/users/users.controller";
import { UPDATE_PROFILE_FORM_SCHEMA } from "shared/form-schemas/profile/update";
import { IAccountUser } from "shared/types";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler({
  PATCH: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestBody",
        options: UPDATE_PROFILE_FORM_SCHEMA,
      },
    ]);
    return await usersController.updateProfile(
      (validatedRequest.authenticatedUser as IAccountUser).username,
      validatedRequest.requestBody
    );
  },
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["authenticatedUser"]);
    return await usersController.getUserProfile(
      (validatedRequest.authenticatedUser as IAccountUser).username
    );
  },
});
