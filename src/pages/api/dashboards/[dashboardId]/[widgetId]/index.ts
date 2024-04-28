import { UserPermissions } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { dashboardWidgetsApiService } from "backend/dashboard-widgets/dashboard-widgets.service";

export default requestHandler(
  {
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: "widgetId" },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsApiService.updateWidget(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
    DELETE: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQueries", options: ["widgetId", "dashboardId"] },
      ]);
      return await dashboardWidgetsApiService.removeWidget(
        validatedRequest.requestQueries
      );
    },
  },
  [
    {
      _type: "notAllowedOnDemo",
    },
    {
      _type: "canUser",
      body: UserPermissions.CAN_MANAGE_DASHBOARD,
    },
  ]
);
