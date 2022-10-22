import { usersController } from "backend/users/users.controller";
import { CHANGE_PASSWORD_FORM_SCHEMA } from "shared/form-schemas/profile/password";
import { IAccountProfile } from "shared/types/user";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler({
  PATCH: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestBody",
        options: CHANGE_PASSWORD_FORM_SCHEMA,
      },
    ]);
    return await usersController.updatePassword(
      (validatedRequest.authenticatedUser as IAccountProfile).username,
      validatedRequest.requestBody
    );
  },
});
