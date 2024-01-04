import { requestHandler } from "backend/lib/request";
import { IAccountProfile } from "shared/types/user";
import { USER_PERMISSIONS } from "shared/constants/user";
import { dashboardWidgetsApiService } from "backend/dashboard-widgets/dashboard-widgets.service";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "authenticatedUser",
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsApiService.runScript(
        validatedRequest.requestBody.script,
        validatedRequest.authenticatedUser as IAccountProfile,
        validatedRequest.requestBody.relativeDate
      );
    },
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "authenticatedUser",
        { _type: "requestQueries", options: ["widgetId", "relativeDate"] },
      ]);
      return await dashboardWidgetsApiService.runWidgetScript(
        validatedRequest.requestQueries.widgetId,
        validatedRequest.authenticatedUser as IAccountProfile,
        validatedRequest.requestQueries.relativeDate
      );
    },
  },
  [
    {
      _type: "notAllowedOnDemo",
      method: ["POST"],
    },
    {
      method: ["POST"],
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
    },
  ]
);
