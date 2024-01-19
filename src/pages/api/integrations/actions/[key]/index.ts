import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { integrationsApiService } from "backend/integrations/integrations.service";

const REQUEST_KEY_FIELD = "key";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
        {
          _type: "requestBody",
          options: {},
        },
      ]);

      return await integrationsApiService.activateIntegration(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
        {
          _type: "requestBody",
          options: {},
        },
        "withPassword",
      ]);

      return await integrationsApiService.updateIntegrationConfig(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
      ]);

      return await integrationsApiService.deactivateIntegration(
        validatedRequest.requestQuery
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_APP_CREDENTIALS,
    },
  ]
);
