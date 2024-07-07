import { requestHandler } from "@/backend/lib/request";
import { usersApiService } from "@/backend/users/users.service";
import { UserPermissions } from "@/shared/constants/user";

export default requestHandler({
  GET: async () => {
    return await usersApiService.listUsers();
  },

  POST: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      {
        _type: "canUser",
        options: UserPermissions.CAN_MANAGE_USERS,
      },
      {
        _type: "requestBody",
        options: {},
      },
    ]);
    return await usersApiService.registerUser(validatedRequest.requestBody);
  },
});
