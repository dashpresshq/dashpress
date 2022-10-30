import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { ROYGBIV } from "shared/constants/colors";
import { HOME_DASHBOARD_KEY, IWidgetConfig } from "shared/types/dashboard";

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
    color: ROYGBIV.blue,
    icon: "home",
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

  await configPersistenceService.resetToEmpty();

  for (const widget of testDashboard) {
    await configPersistenceService.upsertItem(widget.id, widget);
  }

  await configPersistenceService.upsertItem(
    HOME_DASHBOARD_KEY,
    testDashboard
      .filter(({ id }) => id !== "not-in-dashboard")
      .map(({ id }) => id)
  );
};
