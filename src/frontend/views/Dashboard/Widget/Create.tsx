import { useRouteParam } from "@hadmean/protozoa";
import { nanoid } from "nanoid";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useCreateDashboardWidgetMutation } from "../dashboard.store";
import { BaseManageDashboardWidget } from "./_manage";
import { DASHBOARD_WIDGETS_CRUD_CONFIG } from "../constants";

export function CreateDashboardWidget() {
  const dashboardId = useRouteParam("dashboardId");

  const createDashboardWidgetMutation =
    useCreateDashboardWidgetMutation(dashboardId);

  useSetPageDetails({
    pageTitle: DASHBOARD_WIDGETS_CRUD_CONFIG.TEXT_LANG.CREATE,
    viewKey: DASHBOARD_WIDGETS_CRUD_CONFIG.TEXT_LANG.CREATE,
    permission: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
  });

  return (
    <BaseManageDashboardWidget
      action="create"
      onSave={async (data) =>
        await createDashboardWidgetMutation.mutateAsync({
          ...data,
          id: nanoid(),
        })
      }
    />
  );
}
