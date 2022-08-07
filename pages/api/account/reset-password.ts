import { usersController } from "backend/users/users.controller";
import { IAccountUser } from "shared/types";
import { IRequestValidation } from "shared/validations/makeRequestValidationRunnable";
import { requestHandler } from "../../../backend/lib/request";

const resetPasswordRequestSchema: IRequestValidation<
  Pick<IAccountUser, "username" | "password">
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
        (validatedRequest.requestBody as IAccountUser).username,
        (validatedRequest.requestBody as IAccountUser).password
      );
    },
  },
  [
    {
      _type: "isCreator",
    },
  ]
);
