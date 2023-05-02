import { useRouteParam } from "@hadmean/protozoa";
import { nanoid } from "nanoid";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useCreateDashboardWidgetMutation } from "../dashboard.store";
import { BaseManageDashboardWidget } from "./_manage";

export function CreateDashboardWidget() {
  const dashboardId = useRouteParam("dashboardId");

  const createDashboardWidgetMutation =
    useCreateDashboardWidgetMutation(dashboardId);

  useSetPageDetails({
    pageTitle: "Create Dashboard Widget",
    permission: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
    viewKey: "CREATE_DASHBOARD_WIDGET",
  });

  return (
    <BaseManageDashboardWidget
      title="Create"
      onSave={async (data) =>
        await createDashboardWidgetMutation.mutateAsync({
          ...data,
          id: nanoid(),
        })
      }
    />
  );
}
