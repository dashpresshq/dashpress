import {
  IChangePassword,
  usersController,
} from "backend/users/users.controller";
import { IAccountUser } from "shared/types";
import { IRequestValidation } from "shared/validations/makeRequestValidationRunnable";
import { requestHandler } from "../../../backend/lib/request";

const changePasswordRequestSchema: IRequestValidation<IChangePassword> = {
  oldPassword: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  newPassword: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export default requestHandler({
  POST: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestBody",
        options: changePasswordRequestSchema,
      },
    ]);
    return await usersController.updatePassword(
      (validatedRequest.authenticatedUser as IAccountUser).username,
      validatedRequest.requestBody
    );
  },
});
