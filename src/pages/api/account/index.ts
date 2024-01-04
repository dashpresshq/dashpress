import { CREATE_USER_FORM_SCHEMA } from "shared/form-schemas/users/create";
import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { usersApiService } from "backend/users/users.service";

export default requestHandler({
  GET: async () => {
    return await usersApiService.listUsers();
  },

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
    return await usersApiService.registerUser(validatedRequest.requestBody);
  },
});
