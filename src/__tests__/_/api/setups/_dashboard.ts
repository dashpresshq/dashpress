import { createConfigDomainPersistenceService } from "@/backend/lib/config-persistence";
import type { IWidgetConfig } from "@/shared/types/dashboard";
import { HOME_DASHBOARD_KEY } from "@/shared/types/dashboard";

const TEST_DASHBOARDS: Array<IWidgetConfig> = [
  {
    id: "widget-1",
    title: "Widget 1",
    entity: "base-model",
    queryId: "",
    _type: "table",
    script: `return await $.query("SELECT * FROM tests WHERE status = 'opened'")`,
  },
  {
    id: "widget-2",
    _type: "summary-card",
    title: "Widget 2",
    entity: "base-model",
    queryId: "",
    color: "blue",
    icon: "home",
    script: `return await $.query("SELECT count(*) FROM tests")`,
  },
  {
    id: "not-in-dashboard",
    title: "Not In Dashboard",
    entity: "base-model",
    queryId: "",
    _type: "table",
    script: "return 1",
  },
];

export const setupDashboardTestData = async (
  testDashboard: IWidgetConfig[] = TEST_DASHBOARDS
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IWidgetConfig>("dashboard-widgets");

  const itemsOrderPersistenceService =
    createConfigDomainPersistenceService<string[]>("list-order");

  await configPersistenceService.resetToEmpty();

  for (const widget of testDashboard) {
    await configPersistenceService.upsertItem(widget.id, widget);
  }

  await itemsOrderPersistenceService.upsertItem(
    HOME_DASHBOARD_KEY,
    testDashboard
      .filter(({ id }) => id !== "not-in-dashboard")
      .map(({ id }) => id)
  );
};
