import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import getHandler from "pages/api/dashboards/[dashboardId]";
import handler from "pages/api/dashboards/[dashboardId]/[widgetId]/index";
import { HOME_DASHBOARD_KEY } from "shared/types/dashboard";

jest.mock("nanoid", () => ({
  nanoid: jest.fn().mockReturnValueOnce("1"),
}));

describe("/api/dashboards/[dashboardId]/[widgetId]/index", () => {
  const OLD_ENV = process.env;

  beforeAll(async () => {
    await setupAllTestData(["dashboard-widgets"]);
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
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

  it("should not update dashboard widget when on demo account", async () => {
    process.env.NEXT_PUBLIC_IS_DEMO = "true";

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

    expect(postRequest.res._getStatusCode()).toBe(400);
    expect(postRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "This action is not available on the demo site",
        "method": "PATCH",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should not delete dashboard widget when on demo account", async () => {
    process.env.NEXT_PUBLIC_IS_DEMO = "true";

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

    expect(deleteRequest.res._getStatusCode()).toBe(400);
    expect(deleteRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "This action is not available on the demo site",
        "method": "DELETE",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });
});
