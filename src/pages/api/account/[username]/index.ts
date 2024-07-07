import { requestHandler } from "@/backend/lib/request";
import { usersApiService } from "@/backend/users/users.service";
import { UserPermissions } from "@/shared/constants/user";
import type { IAccountProfile } from "@/shared/types/user";

const REQUEST_QUERY_FIELD = "username";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
      ]);
      return await usersApiService.getAccountProfile(
        validatedRequest.requestQuery
      );
    },

    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "authenticatedUser",
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
      ]);
      return await usersApiService.removeUser(
        validatedRequest.requestQuery,
        (validatedRequest.authenticatedUser as IAccountProfile).username
      );
    },
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: {},
        },
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
      ]);
      return await usersApiService.updateUser(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "canUser",
      body: UserPermissions.CAN_MANAGE_USERS,
    },
  ]
);
