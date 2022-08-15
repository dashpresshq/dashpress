import { AUTH_SIGNIN_FORM_SCHEMA } from "shared/form-schemas/auth/signin";
import { usersController } from "../../../backend/users/users.controller";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: AUTH_SIGNIN_FORM_SCHEMA,
        },
      ]);
      return await usersController.login(validatedRequest.requestBody);
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
