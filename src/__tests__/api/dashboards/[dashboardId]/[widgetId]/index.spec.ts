import handler from "pages/api/dashboards/[dashboardId]/[widgetId]/index";
import getHandler from "pages/api/dashboards/[dashboardId]";
import { HOME_DASHBOARD_KEY } from "shared/types/dashboard";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

jest.mock("nanoid", () => ({
  nanoid: jest.fn().mockReturnValueOnce("1"),
}));

describe("/api/dashboards/[dashboardId]/[widgetId]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["dashboard"]);
  });

  it("should update dashboard widget", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "PATCH",
      query: {
        dashboardId: HOME_DASHBOARD_KEY,
        widgetId: "widget-1",
      },
      body: {
        id: "widget-1",
        _type: "table",
        entity: "base-model",
        queryId: "updated-query",
        title: "Updated Title",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(200);

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        dashboardId: HOME_DASHBOARD_KEY,
      },
    });

    await getHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()[0]).toMatchInlineSnapshot(`
      {
        "_type": "table",
        "entity": "base-model",
        "id": "widget-1",
        "queryId": "updated-query",
        "title": "Updated Title",
      }
    `);
  });

  it("should delete dashboard widget", async () => {
    const deleteRequest = createAuthenticatedMocks({
      method: "DELETE",
      query: {
        dashboardId: HOME_DASHBOARD_KEY,
      },
      body: {
        widgetId: "widget-2",
      },
    });

    await handler(deleteRequest.req, deleteRequest.res);

    expect(deleteRequest.res._getStatusCode()).toBe(204);

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        dashboardId: HOME_DASHBOARD_KEY,
      },
    });

    await getHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toHaveLength(1);
  });
});
