import { USER_PERMISSIONS } from "shared/types/user";
import { actionsController } from "backend/actions/actions.controller";
import { requestHandler } from "backend/lib/request";

const REQUEST_KEY_FIELD = "key";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
      ]);

      return await actionsController.listIntegrationActionInstances(
        validatedRequest.requestQuery
      );
    },
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

      return await actionsController.activateAction(
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
      ]);

      return await actionsController.updateActionConfig(
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

      return await actionsController.deactivateAction(
        validatedRequest.requestQuery
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
  ]
);
