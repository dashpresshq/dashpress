import { useRouteParam } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useUpdateDashboardWidgetMutation } from "../dashboard.store";
import { BaseManageDashboardWidget } from "./_manage";

export function UpdateDashboardWidget() {
  const dashboardId = useRouteParam("dashboardId");
  const widgetId = useRouteParam("widgetId");

  const updateDashboardWidgetMutation = useUpdateDashboardWidgetMutation(
    dashboardId,
    widgetId
  );

  useSetPageDetails({
    pageTitle: "Update Dashboard Widget",
    permission: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
    viewKey: "UPDATE_DASHBOARD_WIDGET",
  });

  return (
    <BaseManageDashboardWidget
      action="edit"
      onSave={async (data) =>
        await updateDashboardWidgetMutation.mutateAsync(data)
      }
    />
  );
}
