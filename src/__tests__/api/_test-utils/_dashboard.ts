import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { HOME_DASHBOARD_KEY, IWidgetConfig } from "shared/types";

const TEST_DASHBOARDS: Array<IWidgetConfig> = [
  {
    id: "widget-1",
    title: "Widget 1",
    entity: "base-model",
    queryId: "",
    _type: "table",
  },
  {
    id: "widget-2",
    _type: "summary-card",
    title: "Widget 2",
    entity: "base-model",
    queryId: "",
  },
  {
    id: "not-in-dashboard",
    title: "Not In Dashboard",
    entity: "base-model",
    queryId: "",
    _type: "table",
  },
];

export const setupDashboardTestData = async (
  testDashboard: IWidgetConfig[] = TEST_DASHBOARDS
) => {
  const configPersistenceService = createConfigDomainPersistenceService<
    IWidgetConfig | string[]
  >("dashboard");

  await configPersistenceService.resetState("id", testDashboard);

  await configPersistenceService.upsertItem(HOME_DASHBOARD_KEY, [
    "widget-1",
    "widget-2",
  ]);
};
