import handler from "pages/api/dashboards/[dashboardId]";
import { HOME_DASHBOARD_KEY } from "shared/types";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

jest.mock("nanoid", () => "dooo");

describe("/api/dashboards/[dashboardId]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["dashboard"]);
  });

  it("should list only widgets in requested dashboard", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        dashboardId: HOME_DASHBOARD_KEY,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "_type": "table",
          "entity": "base-model",
          "id": "widget-1",
          "queryId": "",
          "title": "Widget 1",
        },
        {
          "_type": "summary-card",
          "entity": "base-model",
          "id": "widget-2",
          "queryId": "",
          "title": "Widget 2",
        },
      ]
    `);
  });
});
