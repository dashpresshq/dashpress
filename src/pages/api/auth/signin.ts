import { AUTH_SIGNIN_FORM_SCHEMA } from "shared/form-schemas/auth/signin";
import { requestHandler } from "backend/lib/request";
import { usersApiService } from "backend/users/users.service";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: AUTH_SIGNIN_FORM_SCHEMA,
        },
      ]);
      return await usersApiService.tryAuthenticate(
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
