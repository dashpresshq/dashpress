import { UserPermissions } from "shared/constants/user";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useUpdateDashboardWidgetMutation } from "../dashboard.store";
import { BaseManageDashboardWidget } from "./_manage";
import { DASHBOARD_WIDGETS_CRUD_CONFIG } from "../constants";

export function UpdateDashboardWidget() {
  const dashboardId = useRouteParam("dashboardId");
  const widgetId = useRouteParam("widgetId");

  const updateDashboardWidgetMutation = useUpdateDashboardWidgetMutation(
    dashboardId,
    widgetId
  );

  useSetPageDetails({
    pageTitle: DASHBOARD_WIDGETS_CRUD_CONFIG.TEXT_LANG.EDIT,
    viewKey: `edit-dashboard-widget`,
    permission: UserPermissions.CAN_MANAGE_DASHBOARD,
  });

  return (
    <BaseManageDashboardWidget
      action="edit"
      onSave={updateDashboardWidgetMutation.mutateAsync}
    />
  );
}
