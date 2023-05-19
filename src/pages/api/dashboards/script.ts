import { dashboardWidgetsApiController } from "backend/dashboard-widgets/dashboard-widgets.controller";
import { requestHandler } from "backend/lib/request";
import { IAccountProfile } from "shared/types/user";
import { USER_PERMISSIONS } from "shared/constants/user";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "authenticatedUser",
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsApiController.runScript(
        validatedRequest.requestBody.script,
        validatedRequest.authenticatedUser as IAccountProfile
      );
    },
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "authenticatedUser",
        { _type: "requestQueries", options: ["widgetId", "relativeDate"] },
      ]);
      return await dashboardWidgetsApiController.runWidgetScript(
        validatedRequest.requestQueries.widgetId,
        validatedRequest.authenticatedUser as IAccountProfile,
        validatedRequest.requestQueries.relativeDate
      );
    },
  },
  [
    {
      method: ["POST"],
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
    },
  ]
);
