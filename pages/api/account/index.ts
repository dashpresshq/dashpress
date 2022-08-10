import { usersController } from "backend/users/users.controller";
import { CREATE_USER_FORM_SCHEMA } from "shared/form-schemas/users/create";
import { USER_PERMISSIONS } from "shared/types";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler(
  {
    GET: async () => {
      return await usersController.listUsers();
    },

    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: CREATE_USER_FORM_SCHEMA,
        },
      ]);
      return await usersController.createUser(validatedRequest.requestBody);
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_USER,
    },
  ]
);
