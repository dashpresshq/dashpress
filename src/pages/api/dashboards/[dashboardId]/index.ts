import { dashboardWidgetsController } from "backend/dashboard-widgets/dashboard-widgets.controller";
import { USER_PERMISSIONS } from "shared/types/user";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: "dashboardId" },
      ]);
      return await dashboardWidgetsController.listDashboardWidgets(
        validatedRequest.requestQuery
      );
    },
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: "dashboardId" },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsController.createWidget(
        validatedRequest.requestBody,
        validatedRequest.requestQuery
      );
    },
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: "dashboardId" },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsController.updateWidgetList(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      method: ["PATCH", "POST"],
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
    },
  ]
);
