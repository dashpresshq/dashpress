import { usersController } from "backend/users/users.controller";
import { IUser } from "backend/users/users.types";
import { IRequestValidation } from "shared/validations/makeRequestValidationRunnable";
import { requestHandler } from "../../../backend/lib/request";

const updateProfileRequestSchema: IRequestValidation<Pick<IUser, "name">> = {
  name: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export default requestHandler({
  PATCH: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "authenticatedUser",
      {
        _type: "requestBody",
        options: updateProfileRequestSchema,
      },
    ]);
    return await usersController.updateProfile(
      (validatedRequest.authenticatedUser as IUser).username,
      validatedRequest.requestBody
    );
  },
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["authenticatedUser"]);
    return await usersController.getUserProfile(
      (validatedRequest.authenticatedUser as IUser).username
    );
  },
});
