import { AUTH_SIGNIN_FORM_SCHEMA } from "shared/form-schemas/auth/signin";
import { requestHandler } from "backend/lib/request";
import { usersApiController } from "backend/users/users.controller";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: AUTH_SIGNIN_FORM_SCHEMA,
        },
      ]);
      return await usersApiController.login(validatedRequest.requestBody);
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
