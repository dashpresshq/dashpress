import { requestHandler } from "@/backend/lib/request";
import { rolesApiController } from "@/backend/roles/roles.controller";
import { UserPermissions } from "@/shared/constants/user";
import { BASE_ROLE_FORM_SCHEMA } from "@/shared/form-schemas/roles/base";

const REQUEST_QUERY_FIELD = "roleId";

export default requestHandler(
  {
    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
      ]);
      return await rolesApiController.removeRole(validatedRequest.requestQuery);
    },

    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: BASE_ROLE_FORM_SCHEMA,
        },
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
      ]);
      return await rolesApiController.updateRoleDetails(
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
