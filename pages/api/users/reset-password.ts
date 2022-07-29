import { usersController } from "backend/users/users.controller";
import { IUser } from "backend/users/users.types";
import { IRequestValidation } from "shared/validations/makeRequestValidationRunnable";
import { requestHandler } from "../../../backend/lib/request";

const resetPasswordRequestSchema: IRequestValidation<
  Pick<IUser, "username" | "password">
> = {
  username: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  password: {
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: resetPasswordRequestSchema,
        },
      ]);
      return await usersController.resetPassword(
        (validatedRequest.requestBody as IUser).username,
        (validatedRequest.requestBody as IUser).password
      );
    },
  },
  [
    {
      _type: "isCreator",
    },
  ]
);
