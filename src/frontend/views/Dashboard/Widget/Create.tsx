import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { nanoid } from "nanoid";
import { UserPermissions } from "shared/constants/user";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useCreateDashboardWidgetMutation } from "../dashboard.store";
import { BaseManageDashboardWidget } from "./_manage";

export function CreateDashboardWidget() {
  const dashboardId = useRouteParam("dashboardId");
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  const createDashboardWidgetMutation =
    useCreateDashboardWidgetMutation(dashboardId);

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.CREATE,
    viewKey: `create-dashboard-widget`,
    permission: UserPermissions.CAN_MANAGE_DASHBOARD,
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
