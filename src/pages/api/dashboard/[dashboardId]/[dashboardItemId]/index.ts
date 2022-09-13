import { dashboardController } from "backend/dashboard/dashboard.controller";
import { USER_PERMISSIONS } from "shared/types";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: "dashboardItemId" },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardController.updateDashboardItem(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: "dashboardId" },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardController.removeDashboardItem(
        validatedRequest.requestBody.dashboardItemId,
        validatedRequest.requestQuery
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
