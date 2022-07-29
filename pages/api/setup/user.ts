import {
  IUserSetupFields,
  setupController,
} from "backend/setup/setup.controller";
import { IRequestValidation } from "shared/validations/makeRequestValidationRunnable";
import { requestHandler } from "../../../backend/lib/request";

const userSetupRequestSchema: IRequestValidation<IUserSetupFields> = {
  username: {
    validations: [
      {
        validationType: "required",
      },
      {
        validationType: "alphanumeric",
      },
    ],
  },
  name: {
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
          options: userSetupRequestSchema,
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
