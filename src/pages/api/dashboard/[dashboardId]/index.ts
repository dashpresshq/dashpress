import { dashboardController } from "backend/dashboard/dashboard.controller";
import { USER_PERMISSIONS } from "shared/types";
import { dashboardController } from "../../../../backend/dashboard/dashboard.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "entity",
        {
          _type: "requestQuery",
          options: "search",
        },
      ]);
      return await dataController.listData(
        validatedRequest.entity,
        validatedRequest.requestQuery
      );
    },
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "entity",
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardController.createDashboard(
        validatedRequest.entity,
        validatedRequest.requestBody
      );
    },
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "entity",
        "entityRequestBody",
      ]);
      return await dataController.createData(
        validatedRequest.entity,
        validatedRequest.entityRequestBody
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
    },
  ]
);
