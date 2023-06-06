import handler from "pages/api/dashboards/[dashboardId]";
import { HOME_DASHBOARD_KEY } from "shared/types/dashboard";
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
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  beforeAll(async () => {
    await setupAllTestData(["dashboard-widgets", "schema", "app-config"]);
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
          "script": "return await $.query("SELECT * FROM tests WHERE status = 'opened'")",
          "title": "Widget 1",
        },
        {
          "_type": "summary-card",
          "color": "#0000FF",
          "entity": "base-model",
          "icon": "home",
          "id": "widget-2",
          "queryId": "",
          "script": "return await $.query("SELECT count(*) FROM tests")",
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
          "color": "#0000FF",
          "entity": "base-model",
          "icon": "home",
          "id": "widget-2",
          "queryId": "",
          "script": "return await $.query("SELECT count(*) FROM tests")",
          "title": "Widget 2",
        },
        {
          "_type": "table",
          "entity": "base-model",
          "id": "widget-1",
          "queryId": "",
          "script": "return await $.query("SELECT * FROM tests WHERE status = 'opened'")",
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

  it("should not create new dashboard widget on demo account", async () => {
    process.env.NEXT_PUBLIC_IS_DEMO = "true";

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

    expect(postRequest.res._getStatusCode()).toBe(400);
    expect(postRequest.res._getJSONData()).toMatchInlineSnapshot(`
    {
      "message": "Cannot create widget in demo mode",
      "method": "POST",
      "name": "BadRequestError",
      "path": "",
      "statusCode": 400,
    }
  `);
  });
});

describe("/api/dashboards/[dashboardId]/index generation", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "app-config"]);
    await setupDashboardTestData([]);
  });

  it("should generate dashboard", async () => {
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
          "color": "red",
          "entity": "base-model",
          "icon": "ShoppingCart",
          "id": "1",
          "script": "const actual = await $.query(\`SELECT count(*) FROM "base-model"\`);
      const relative = await $.query(\`SELECT count(*) FROM "base-model" WHERE "createdAt" < '$.RELATIVE_TIME'\`);

      return [...actual, ...relative];
                  ",
          "title": "Base Model",
        },
        {
          "_type": "summary-card",
          "color": "orange",
          "entity": "secondary-model",
          "icon": "Activity",
          "id": "2",
          "script": "return await $.query('SELECT count(*) FROM "secondary-model"')",
          "title": "Secondary Model",
        },
        {
          "_type": "summary-card",
          "color": "yellow",
          "entity": "tests",
          "icon": "ShoppingBag",
          "id": "3",
          "script": "const actual = await $.query(\`SELECT count(*) FROM "tests"\`);
      const relative = await $.query(\`SELECT count(*) FROM "tests" WHERE "createdAt" < '$.RELATIVE_TIME'\`);

      return [...actual, ...relative];
                  ",
          "title": "Tests",
        },
        {
          "_type": "table",
          "entity": "base-model",
          "id": "4",
          "script": "return await $.query('SELECT * FROM "base-model" LIMIT 5')",
          "title": "Base Model",
        },
      ]
    `);
  });
});
