import { requestHandler } from "@/backend/lib/request";
import { setupApiService } from "@/backend/setup/setup.service";
import { SETUP_USER_FORM_SCHEMA } from "@/shared/form-schemas/setup/user";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: SETUP_USER_FORM_SCHEMA,
        },
      ]);
      return await setupApiService.setUpFirstUser(validatedRequest.requestBody);
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
