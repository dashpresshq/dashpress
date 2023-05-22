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
    script: "return 1",
    title: "Foo Table",
  },
  {
    _type: "summary-card",
    entity: "entity-1",
    color: "red",
    icon: "<p>Some SVG Here</p>",
    queryId: "",
    script: "return 1",
    title: "Bar Card",
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
      const requestBody = await req.json();
      if (
        req.params.dashboardId === "test-dashboard-id" &&
        [
          `{"icon":"Download","title":"New Summary Card","_type":"summary-card","entity":"entity-1","color":"green","script":"return 1","id":"new_id_1"}`,
          `{"icon":"ShoppingCart","title":"New Table","_type":"table","entity":"entity-1","size":"2","height":"250","script":"return 1","id":"new_id_2"}`,
        ].includes(JSON.stringify(requestBody))
      ) {
        DASHBOARD_WIDGETS.push(requestBody);
        return res(ctx.status(204));
      }
      return res(ctx.status(500));
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
