import { rolesApiController } from "backend/roles/roles.controller";
import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";

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
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
        {
          _type: "requestBody",
          options: {}, // TODO fix
        },
      ]);
      return await rolesApiController.removePermissions(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
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
      body: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
    },
  ]
);
