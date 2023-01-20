import { MutationHelpers } from "@hadmean/protozoa";
import { rest } from "msw";
import { IWidgetConfig } from "shared/types/dashboard";
import { BASE_TEST_URL } from "./_utils";

let DASHBOARD_WIDGETS: IWidgetConfig[] = [
  {
    _type: "table",
    entity: "entity-1",
    id: "table_id_1",
    queryId: "",
    title: "Foo Table",
  },
  {
    _type: "summary-card",
    entity: "entity-1",
    color: "red",
    icon: "<p>Some SVG Here</p>",
    queryId: "",
    title: "Bar Card",
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
      return res(ctx.status(204));
    }
  ),
  rest.patch(
    BASE_TEST_URL("/api/dashboards/:dashboardId/:widgetId"),
    async (req, res, ctx) => {
      const index = DASHBOARD_WIDGETS.findIndex(
        ({ id }) => id === req.params.widgetId
      );
      DASHBOARD_WIDGETS[index] = await req.json();
      return res(ctx.status(204));
    }
  ),
  rest.patch(
    BASE_TEST_URL("/api/dashboards/:dashboardId"),
    async (req, res, ctx) => {
      DASHBOARD_WIDGETS = MutationHelpers.sortOrder(
        DASHBOARD_WIDGETS,
        await req.json()
      );
      return res(ctx.status(204));
    }
  ),
  rest.delete(
    BASE_TEST_URL("/api/dashboards/:dashboardId/:widgetId"),
    async (req, res, ctx) => {
      DASHBOARD_WIDGETS.splice(
        DASHBOARD_WIDGETS.findIndex(({ id }) => id === req.params.widgetId),
        1
      );

      return res(ctx.status(204));
    }
  ),
];
