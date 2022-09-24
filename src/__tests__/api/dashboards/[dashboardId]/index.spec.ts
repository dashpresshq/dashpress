import handler from "pages/api/dashboards/[dashboardId]";
import { HOME_DASHBOARD_KEY } from "shared/types";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";
import { setupDashboardTestData } from "__tests__/api/_test-utils/_dashboard";

jest.mock("nanoid", () => ({
  nanoid: jest
    .fn()
    .mockReturnValueOnce("1")
    .mockReturnValueOnce("2")
    .mockReturnValueOnce("3")
    .mockReturnValueOnce("4")
    .mockReturnValueOnce("5")
    .mockReturnValueOnce("6"),
}));

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

  it("should order dashboard widget", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "PATCH",
      query: {
        dashboardId: HOME_DASHBOARD_KEY,
      },
      body: ["widget-2", "widget-1"],
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(200);

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
          "_type": "summary-card",
          "entity": "base-model",
          "id": "widget-2",
          "queryId": "",
          "title": "Widget 2",
        },
        {
          "_type": "table",
          "entity": "base-model",
          "id": "widget-1",
          "queryId": "",
          "title": "Widget 1",
        },
      ]
    `);
  });

  it("should create new dashboard widget", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "POST",
      query: {
        dashboardId: HOME_DASHBOARD_KEY,
      },
      body: {
        _type: "table",
        entity: "base-model",
        id: "widget-3",
        queryId: "some-test-query-id",
        title: "Widget 3",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(201);

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        dashboardId: HOME_DASHBOARD_KEY,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()[2]).toMatchInlineSnapshot(`
      {
        "_type": "table",
        "entity": "base-model",
        "id": "widget-3",
        "queryId": "some-test-query-id",
        "title": "Widget 3",
      }
    `);
  });
});

describe("/api/dashboards/[dashboardId]/index generation", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema"]);
    await setupDashboardTestData([]);
  });

  it("should not generate dashboard for none HOME dashboard", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        dashboardId: "some-existent-dashboard",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`[]`);
  });

  it("should generate dashboard for HOME dashboard", async () => {
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
          "_type": "summary-card",
          "entity": "base-model",
          "id": "1",
          "queryId": "",
          "statusField": "createdAt",
          "title": "Base Model",
        },
        {
          "_type": "summary-card",
          "entity": "secondary-model",
          "id": "2",
          "queryId": "",
          "statusField": "createdAt",
          "title": "Secondary Model",
        },
        {
          "_type": "summary-card",
          "entity": "tests",
          "id": "3",
          "queryId": "",
          "statusField": "createdAt",
          "title": "Tests",
        },
        {
          "_type": "table",
          "entity": "base-model",
          "id": "4",
          "queryId": "",
          "title": "Base Model",
        },
      ]
    `);
  });
});
