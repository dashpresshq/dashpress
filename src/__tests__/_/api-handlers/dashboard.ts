import { rest } from "msw";
import { IWidgetConfig } from "shared/types/dashboard";
import { BASE_TEST_URL } from "./_utils";

const DASHBOARD_WIDGETS: IWidgetConfig[] = [
  {
    _type: "table",
    entity: "entity-1",
    id: "table_id_1",
    queryId: "",
    title: "Table Widget 1",
  },
  {
    _type: "summary-card",
    entity: "entity-1",
    color: "#ff00ff",
    icon: "<p>Some SVG Here</p>",
    queryId: "",
    title: "Summary Widget 1",
    dateField: "",
    id: "summary_card_id_1",
  },
];

export const dashboardApiHandlers = [
  rest.get(
    BASE_TEST_URL("/api/dashboards/:dashboardId"),
    async (_, res, ctx) => {
      return res(ctx.json(DASHBOARD_WIDGETS));
    }
  ),
  rest.post(
    BASE_TEST_URL("/api/dashboards/:dashboardId"),
    async (req, res, ctx) => {
      DASHBOARD_WIDGETS.push(await req.json());
      return res(ctx.json(204));
    }
  ),
];
