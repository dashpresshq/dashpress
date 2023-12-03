import { USER_PERMISSIONS } from "shared/constants/user";
import { configurationApiController } from "backend/configuration/configuration.controller";
import { requestHandler } from "backend/lib/request";

const REQUEST_QUERY_FIELD = "key";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
        {
          _type: "entity",
          options: true,
        },
      ]);
      return await configurationApiController.showConfig(
        validatedRequest.requestQuery,
        validatedRequest.entity
      );
    },
    PUT: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_QUERY_FIELD,
        },
        {
          _type: "entity",
          options: true,
        },
        {
          _type: "requestBody",
          options: {},
        },
      ]);
      return await configurationApiController.upsertConfig(
        validatedRequest.requestQuery,
        validatedRequest.requestBody.data,
        validatedRequest.entity
      );
    },
  },
  [
    {
      method: ["PUT"],
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_CONFIGURE_APP,
    },
  ]
);
