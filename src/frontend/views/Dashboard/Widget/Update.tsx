import { useDomainMessages } from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import { useRouteParam } from "@/frontend/lib/routing/useRouteParam";
import { UserPermissions } from "@/shared/constants/user";

import { useUpdateDashboardWidgetMutation } from "../dashboard.store";
import { BaseManageDashboardWidget } from "./_manage";

export function UpdateDashboardWidget() {
  const dashboardId = useRouteParam("dashboardId");
  const widgetId = useRouteParam("widgetId");
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  const updateDashboardWidgetMutation = useUpdateDashboardWidgetMutation(
    dashboardId,
    widgetId
  );

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.EDIT,
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
