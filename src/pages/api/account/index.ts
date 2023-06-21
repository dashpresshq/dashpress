import { usersApiController } from "backend/users/users.controller";
import { CREATE_USER_FORM_SCHEMA } from "shared/form-schemas/users/create";
import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "../../../backend/lib/request";

export default requestHandler({
  GET: async () => {
    return await usersApiController.listUsers();
  },

  // :eyes
  POST: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      {
        _type: "canUser",
        options: USER_PERMISSIONS.CAN_MANAGE_USERS,
      },
      {
        _type: "requestBody",
        options: CREATE_USER_FORM_SCHEMA,
      },
    ]);
    return await usersApiController.createUser(validatedRequest.requestBody);
  },
});
