import { setupController } from "backend/setup/setup.controller";
import { SETUP_USER_FORM_SCHEMA } from "shared/form-schemas/setup/user";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: SETUP_USER_FORM_SCHEMA,
        },
      ]);
      return await setupController.setUpFirstUser(validatedRequest.requestBody);
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
