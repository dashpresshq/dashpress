import { USER_PERMISSIONS } from "shared/constants/user";
import { UPDATE_USER_FORM_SCHEMA } from "shared/form-schemas/users/update";
import { IAccountProfile } from "shared/types/user";
import { requestHandler } from "backend/lib/request";
import { usersApiService } from "backend/users/users.service";

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
      return await usersApiService.getUser(validatedRequest.requestQuery);
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
          options: UPDATE_USER_FORM_SCHEMA,
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
      body: USER_PERMISSIONS.CAN_MANAGE_USERS,
    },
  ]
);
