import { dashboardWidgetsApiService } from "backend/dashboard-widgets/dashboard-widgets.service";
import { requestHandler } from "backend/lib/request";
import { UserPermissions } from "shared/constants/user";
import type { IAccountProfile } from "shared/types/user";

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
      body: UserPermissions.CAN_MANAGE_DASHBOARD,
    },
  ]
);
