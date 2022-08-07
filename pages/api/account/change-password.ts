import { usersController } from "backend/users/users.controller";
import { CHANGE_PASSWORD_FORM_SCHEMA } from "shared/form-schemas/profile/password";
import { IAccountUser } from "shared/types";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler({
  POST: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestBody",
        options: CHANGE_PASSWORD_FORM_SCHEMA,
      },
    ]);
    return await usersController.updatePassword(
      (validatedRequest.authenticatedUser as IAccountUser).username,
      validatedRequest.requestBody
    );
  },
});
