import { rolesController } from "backend/roles/roles.controller";
import { BASE_PERMISSION_FORM_SCHEMA } from "shared/form-schemas/roles/permissions/base";
import { USER_PERMISSIONS } from "shared/types";
import { requestHandler } from "../../../../backend/lib/request";

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
      return await rolesController.getRolePermissions(
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
          options: BASE_PERMISSION_FORM_SCHEMA,
        },
      ]);
      return await rolesController.removePermission(
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
          options: BASE_PERMISSION_FORM_SCHEMA,
        },
      ]);
      return await rolesController.addPermission(
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
