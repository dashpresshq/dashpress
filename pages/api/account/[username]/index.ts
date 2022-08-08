import { usersController } from "backend/users/users.controller";
import { UPDATE_USER_FORM_SCHEMA } from "shared/form-schemas/users/update";
import { requestHandler } from "../../../../backend/lib/request";

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
      return await usersController.getUserProfile(
        validatedRequest.requestQuery
      );
    },

    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
      ]);
      return await usersController.removeUser(validatedRequest.requestQuery);
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
      return await usersController.updateProfile(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "isCreator",
    },
  ]
);
