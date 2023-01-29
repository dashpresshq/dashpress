import { dashboardWidgetsController } from "backend/dashboard-widgets/dashboard-widgets.controller";
import { USER_PERMISSIONS } from "shared/types/user";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: "widgetId" },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsController.updateWidget(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: "dashboardId" },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsController.removeWidget(
        validatedRequest.requestBody.widgetId,
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
