import { dataNotFoundMessage, useApi } from "@hadmean/protozoa";
import { HOME_DASHBOARD_KEY, IWidgetConfig } from "shared/types";

const DASHBOARD_ENDPOINT = (dashboardId: string) =>
  `/api/dashboards/${dashboardId}`;

export const useDashboardWidgets = (dashboardId = HOME_DASHBOARD_KEY) => {
  return useApi<IWidgetConfig[]>(DASHBOARD_ENDPOINT(dashboardId), {
    errorMessage: dataNotFoundMessage("Dashboard widgets"),
  });
};
