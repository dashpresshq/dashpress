import { requestHandler } from "backend/lib/request";
import { rolesApiController } from "backend/roles/roles.controller";
import { UserPermissions } from "shared/constants/user";
import { ensureIsArray } from "shared/lib/array/ensure";

const REQUEST_QUERY_FIELD = "roleId";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
      ]);
      return await rolesApiController.getRolePermissions(
        validatedRequest.requestQuery
      );
    },

    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQueries",
          options: [REQUEST_QUERY_FIELD, "permissions"],
        },
      ]);
      return await rolesApiController.removePermissions(
        validatedRequest.requestQueries.roleId,
        ensureIsArray(validatedRequest.requestQueries.permissions)
      );
    },

    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
        {
          _type: "requestBody",
          options: {},
        },
      ]);
      return await rolesApiController.addPermissions(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "canUser",
      body: UserPermissions.CAN_MANAGE_PERMISSIONS,
    },
  ]
);
